import { expect, test } from "@playwright/test";
import { startHistoryApp } from "./support/home-fund-movement-history-app.mjs";
import { accountId } from "./support/home-fund-movement-history/fixtures.mjs";

test.describe("Home account history with real Next and controlled upstream", () => {
  test.describe.configure({ mode: "serial", timeout: 120_000 });
  let app;
  test.beforeAll(async () => { app = await startHistoryApp(3198); });
  test.afterAll(async () => { await app?.close(); });

  test("clicked card identity, all seven kinds, historical balance and home return", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${app.url}/home`);
    await page.getByRole("link", { name: /카드 전체 자금 이동 내역/ }).click();
    await expect(page).toHaveURL(new RegExp(`accountId=${accountId}`));
    await expect(page.getByRole("heading", { name: "전체 자금 이동 내역" })).toBeVisible();
    await expect(page.locator("[data-event-id]")).toHaveCount(7);
    await expect(page.getByText("사용 가능 잔액 0원 · 당시 부족 2,000원")).toBeVisible();
    await expect(page.getByText("2,000원 이동", { exact: true })).toBeVisible();
    await expect(page.getByText("여름 자전거 → 여름 운동화", { exact: true })).toBeVisible();
    for (const text of ["위시 넣기", "위시 빼기", "위시 완료 반환", "위시 포기 반환", "위시 삭제 반환", "카드 잔액 변경"]) await expect(page.getByText(text, { exact: true })).toBeVisible();
    await expect(page.getByRole("navigation")).toHaveCount(0);
    const first = app.requests.at(-1);
    expect(first).toMatchObject({ sort: "desc", limit: "30" });
    expect(first.from).toBeTruthy(); expect(first.to).toBeTruthy();
    await page.getByRole("button", { name: "더 보기" }).click();
    await expect(page.locator("[data-event-id]")).toHaveCount(8);
    expect(app.requests.at(-1)).toMatchObject({ ...first, cursor: "page-two" });
    await page.getByRole("button", { name: "뒤로 가기" }).click();
    await expect(page).toHaveURL(`${app.url}/home`);
  });

  test("full server search, filters discard cursor, stale responses, and narrow layout", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(`${app.url}/home/fund-movements?accountId=${accountId}`);
    await expect(page.locator("[data-event-id]")).toHaveCount(7);
    await page.getByLabel("조회 기간").selectOption("all");
    await page.getByLabel("정렬 순서").selectOption("asc");
    const input = page.getByRole("textbox", { name: "위시 이름, 이동 종류, 금액 검색" });
    await input.fill("느린 검색"); await page.getByRole("button", { name: "검색", exact: true }).click();
    await expect.poll(() => app.requests.some(request => request.q === "느린 검색")).toBe(true);
    await input.fill("피아노"); await page.getByRole("button", { name: "검색", exact: true }).click();
    await expect(page.locator("[data-event-id=old]")).toBeVisible();
    expect(app.requests.at(-1)).toEqual({ q: "피아노", sort: "asc", limit: "30" });
    await page.waitForTimeout(1300);
    await expect(page.locator("[data-event-id]")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: "test-results/home-fund-movement-history-320.png", fullPage: true });
    await input.fill("없는 내역"); await page.getByRole("button", { name: "검색", exact: true }).click();
    await expect(page.getByText("검색 결과가 없어요.")).toBeVisible();
    await input.fill("오류"); await page.getByRole("button", { name: "검색", exact: true }).click();
    await expect(page.getByRole("main").getByRole("alert")).toBeVisible();
    const before = app.requests.length;
    await page.getByRole("button", { name: "다시 시도" }).click();
    await expect.poll(() => app.requests.length).toBeGreaterThan(before);
    await page.getByRole("button", { name: "검색 지우기" }).click();
    await expect(page.locator("[data-event-id]")).toHaveCount(7);
  });

  test("unavailable account does not substitute another account", async ({ page }) => {
    await page.goto(`${app.url}/home/fund-movements?accountId=other-account`);
    await expect(page.getByRole("main").getByRole("alert")).toBeVisible();
    await expect(page.locator("[data-event-id]")).toHaveCount(0);
  });
});
