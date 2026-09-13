import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const origin = process.env.DEMO_FRONTEND_ORIGIN;
test("real demo representatives retain identity across SSR, BFF, navigation and behavior context", async ({ browser }) => {
  test.skip(!origin, "Set DEMO_FRONTEND_ORIGIN to a real locally connected demo frontend");
  test.setTimeout(120000);
  const observations = [];
  const accountIds = new Set();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  let previousContext;
  for (const grade of [3, 4, 5, 6]) {
    await page.goto(`${origin}/demo`);
    await page.getByRole("combobox", { name: "데모 대표", exact: true }).selectOption(`grade-${grade}`);
    await expect(page.getByRole("heading", { name: `${grade}학년 대표`, exact: true })).toBeVisible();
    const accountId = await page.getByTestId("demo-account-id").innerText();
    expect(accountIds.has(accountId)).toBe(false);
    accountIds.add(accountId);
    const accounts = await (await context.request.get(`${origin}/api/backend/v1/me/card-balance-accounts`)).json();
    expect(accounts.items).toHaveLength(1);
    expect(accounts.items[0].cardBalanceAccountId).toBe(accountId);
    const academyId = accounts.items[0].academyId;
    const contextResponse = await context.request.post(`${origin}/api/behavior/context`, {data: {academyId}});
    expect(contextResponse.status()).toBe(200);
    const behavior = await contextResponse.json();
    expect(behavior.contextId).toBeTruthy();
    if (previousContext) {
      const stale = await context.request.post(`${origin}/api/backend/v1/academies/${academyId}/profile-visits`, {headers:{"X-Crabit-Behavior-Context": previousContext},data:{}});
      expect(stale.status()).toBe(409);
    }
    previousContext = behavior.contextId;
    await page.reload();
    await expect(page.getByTestId("demo-account-id")).toHaveText(accountId);
    const weekStart = "2026-08-31";
    const weeklyRoute = `/recaps/weekly?weekStart=${weekStart}`;
    // Fetch before navigation so network latency does not consume the story's first slide.
    const weeklyResponse = await context.request.get(`${origin}/api/backend/v1/card-balance-accounts/${accountId}${weeklyRoute}`);
    expect(weeklyResponse.status()).toBe(200);
    const weekly = await weeklyResponse.json();
    expect(weekly.status).toBe("SUCCEEDED");
    expect(weekly.period.startDate).toBe(weekStart);
    expect(weekly.result).not.toBeNull();
    const routes = [];
    for (const route of ["/home", "/wishes", "/feed", weeklyRoute, "/recaps/monthly?month=2026-08"]) {
      const response = await page.goto(`${origin}${route}`);
      expect(response.status()).toBe(200);
      await expect(page.getByRole("combobox", {name:"데모 대표",exact:true})).toHaveValue(`grade-${grade}`);
      await expect(page.locator("body")).not.toContainText("Application error");
      if (route === "/home") {
        await expect(page.getByText(`${grade}학년 대표의 크래빗 카드`, {exact:true})).toBeVisible();
        await expect(page.locator("body")).toContainText(accounts.items[0].actualCardBalance.toLocaleString("ko-KR"));
      }
      if (route === "/feed") {
        // A 200 shell can still contain a failed feed request. Require actual card content.
        await expect(page.getByRole("link", {name:"방문하기",exact:true}).first()).toBeVisible({timeout:15000});
        await expect(page.getByRole("alert")).toHaveCount(0);
      }
      if (route === weeklyRoute) {
        const { achievement, streak, milestone } = weekly.result.page1LastWeekPerformance;
        const headline = [achievement.message, streak.message, milestone.message]
          .filter((message) => message !== null).join("\n");
        expect(headline.trim()).not.toBe("");
        await expect(page.getByText(headline, {exact:true})).toBeVisible();
        const savingsCard = page.getByText("모인 금액", {exact:true}).locator("..");
        await expect(savingsCard.getByText(achievement.netSavings.toLocaleString("ko-KR"), {exact:true})).toBeVisible();
        const newWishCard = page.getByText("새로 등록한 위시", {exact:true}).locator("..");
        await expect(newWishCard.getByText(`${achievement.newWishCount} 개`, {exact:true})).toBeVisible();
        await expect(page.getByText("주간요약을 준비하고 있어요!", {exact:true})).toHaveCount(0);
      }
      if (route.startsWith("/recaps/monthly")) {
        const resource = await context.request.get(`${origin}/api/backend/v1/card-balance-accounts/${accountId}/recaps/monthly?month=2026-08`);
        expect(resource.status()).toBe(200);
        const monthly = await resource.json();
        if (monthly.status === "SUCCEEDED") {
          await expect(page.getByText(`8월의 ${grade}학년 대표는`, {exact:true})).toBeVisible();
          await expect(page.locator("body")).toContainText(monthly.result.typeSection.typeTitle);
        } else if (monthly.status === "NOT_ELIGIBLE") {
          await expect(page.locator("body")).toContainText("유효한 저축이 3건 미만");
          await expect(page.locator("body")).not.toContainText("9월 초에 다시");
        }
      }
      routes.push(route);
    }
    const monthly = await context.request.get(`${origin}/api/backend/v1/card-balance-accounts/${accountId}/recaps/monthly?month=2026-08`);
    expect(monthly.status()).toBe(200);
    observations.push({grade, accountId, balance: accounts.items[0].actualCardBalance, weekly: weekly.status, weeklyVisibleBody: true, monthly: (await monthly.json()).status, routes});
  }
  await page.setViewportSize({width:375,height:812});
  await page.goto(`${origin}/demo`);
  await expect(page.getByTestId("demo-account-id")).toHaveText(observations[3].accountId);
  const selector = page.getByRole("combobox", {name:"데모 대표",exact:true});
  await selector.focus(); await expect(selector).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("link", {name:"홈",exact:true}).click();
  await expect(page).toHaveURL(`${origin}/home`);
  await page.goBack();
  await expect(page.getByTestId("demo-account-id")).toHaveText(observations[3].accountId);
  await selector.selectOption("grade-3");
  await expect(page.getByTestId("demo-account-id")).toHaveText(observations[0].accountId);
  await page.reload();
  await expect(page.getByTestId("demo-account-id")).toHaveText(observations[0].accountId);
  const invalid = await context.request.get(`${origin}/api/backend/v1/me/card-balance-accounts`, {headers:{Cookie:"crabit-demo-persona=grade-3; crabit-demo-persona=grade-4"}});
  expect(invalid.status()).toBe(401);
  await mkdir("docs/demo/artifacts", {recursive:true});
  await page.screenshot({path:"docs/demo/artifacts/representative-mobile.png",fullPage:true});
  await page.setViewportSize({width:1280,height:900});
  await page.screenshot({path:"docs/demo/artifacts/representative-desktop.png",fullPage:true});
  await writeFile("docs/demo/artifacts/representative-ui.json", JSON.stringify({checkedAt:new Date().toISOString(), origin, observations, mobileWidth:375, overflow:false, staleContextRejected:true, duplicateCookieRejected:true, ownerRefreshPerformed:false},null,2)+"\n");
  await context.close();
});
