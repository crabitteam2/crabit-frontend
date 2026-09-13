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
    const routes = [];
    for (const route of ["/home", "/wishes", "/feed", "/recaps/weekly?weekStart=2026-08-31", "/recaps/monthly?month=2026-08"]) {
      const response = await page.goto(`${origin}${route}`);
      expect(response.status()).toBe(200);
      await expect(page.getByRole("combobox", {name:"데모 대표",exact:true})).toHaveValue(`grade-${grade}`);
      await expect(page.locator("body")).not.toContainText("Application error");
      routes.push(route);
    }
    const weekly = await context.request.get(`${origin}/api/backend/v1/card-balance-accounts/${accountId}/recaps/weekly?weekStart=2026-08-31`);
    const monthly = await context.request.get(`${origin}/api/backend/v1/card-balance-accounts/${accountId}/recaps/monthly?month=2026-08`);
    expect(weekly.status()).toBe(200); expect(monthly.status()).toBe(200);
    observations.push({grade, accountId, balance: accounts.items[0].actualCardBalance, weekly: (await weekly.json()).status, monthly: (await monthly.json()).status, routes});
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
