import { test, expect } from "@playwright/test";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
const academy = "11111111-1111-4111-8111-111111111111";
const student = "22222222-2222-4222-8222-222222222222";
const card = "33333333-3333-4333-8333-333333333333";
const academy2 = "44444444-4444-4444-8444-444444444444";
const card2 = "55555555-5555-4555-8555-555555555555";
const events = [];
const results = [];
let multiPage = false,
  unavailableStudent = false,
  rejectEvents = false;
let app, backend, base;
test.describe.configure({ mode: "serial" });
test.beforeEach(() => {
  events.length = 0;
  results.length = 0;
  multiPage = false;
  unavailableStudent = false;
  rejectEvents = false;
});
test.beforeAll(async () => {
  backend = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const path = new URL(request.url, "http://backend").pathname;
    let result,
      status = 200;
    if (path.endsWith("/card-balance-accounts"))
      result = {
        items: [academy, academy2].map((academyId) => ({
          cardBalanceAccountId: randomUUID(),
          academyId,
        })),
        nextCursor: null,
      };
    else if (path.endsWith("/feed-results")) {
      const input = JSON.parse(Buffer.concat(chunks).toString());
      result = {
        resultContextId: randomUUID(),
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        sortSource: "LATEST",
        recommendationResultId: null,
        modelVersion: null,
        nextCursor: multiPage && !input.cursor ? "second-page" : null,
        items: [
          {
            sharedCardId: input.cursor ? card2 : card,
            kind: "PROGRESS",
            ownerId: student,
            ownerNickname: "실제 학생",
            purpose: input.cursor ? "두 번째 위시" : "새 자전거",
            targetAmount: 100000,
            progressPercent: 37,
            photo: null,
            startDate: null,
            targetDate: null,
            balanceAdjustmentInProgress: false,
            contentUpdatedAt: new Date().toISOString(),
          },
        ],
      };
      results.push({ path, input, ...result });
    } else if (path.endsWith(`/students/${student}`)) {
      status = unavailableStudent ? 404 : 200;
      result = unavailableStudent
        ? { code: "STUDENT_NOT_FOUND" }
        : {
            studentId: student,
            nickname: "실제 학생",
            isFollowing: false,
            isFollowedBy: false,
          };
    } else if (path.endsWith("/shared-cards"))
      result = { items: [], nextCursor: null };
    else if (/\/(feed-events|profile-visits)$/.test(path)) {
      events.push({
        path,
        authorization: request.headers.authorization,
        ...JSON.parse(Buffer.concat(chunks).toString()),
      });
      status = rejectEvents ? 503 : 201;
      result = rejectEvents ? { code: "UNAVAILABLE" } : { accepted: true };
    } else {
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify(result));
  });
  backend.listen(0, "127.0.0.1");
  await once(backend, "listening");
  const reservation = createServer();
  reservation.listen(0, "127.0.0.1");
  await once(reservation, "listening");
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  base = `http://127.0.0.1:${port}`;
  app = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      env: {
        ...process.env,
        APP_ENV: "e2e",
        BACKEND_PROFILE: "e2e",
        BACKEND_URL: `http://127.0.0.1:${backend.address().port}`,
        E2E_OWNER_TOKEN: "fixture-owner",
        E2E_FRIEND_TOKEN: "fixture-friend",
        E2E_NONFRIEND_TOKEN: "fixture-nonfriend",
        E2E_BLOCKED_TOKEN: "fixture-blocked",
        E2E_OTHER_ACADEMY_TOKEN: "fixture-other",
        E2E_STAFF_TOKEN: "fixture-staff",
      },
      stdio: "ignore",
    },
  );
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(`${base}/api/e2e/persona`);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error("Application did not start");
});

function feedPage(ids, nextCursor, resultContextId = randomUUID()) {
  return {
    resultContextId, nextCursor, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString(), sortSource: "LATEST", recommendationResultId: null, modelVersion: null,
    items: ids.map((id, index) => ({ sharedCardId: id, kind: "PROGRESS", ownerId: student, ownerNickname: "스크롤 학생", purpose: `목표 ${id.slice(-3)}`, targetAmount: 100000, progressPercent: 30 + index, photo: null, startDate: null, targetDate: null, balanceAdjustmentInProgress: false, contentUpdatedAt: new Date().toISOString() })),
  };
}
const ids = Array.from({ length: 20 }, (_, index) => `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`);
for (const [device, viewport] of [["mobile", { width: 390, height: 844 }], ["desktop", { width: 1280, height: 900 }]]) {
  test(`${device}: real scroll appends, deduplicates and ends with original second-page tracking`, async ({ page }, testInfo) => {
    const requests = [];
    const secondContext = randomUUID();
    await page.setViewportSize(viewport);
    await page.request.post(`${base}/api/e2e/persona`, { data: { persona: "owner" } });
    await page.route("**/feed-results", async route => {
      const input = route.request().postDataJSON(); requests.push(input);
      await route.fulfill({ json: input.cursor ? feedPage([ids[0], ...ids.slice(10)], null, secondContext) : feedPage(ids.slice(0, 10), "page-two") });
    });
    await page.goto(`${base}/feed`);
    await expect(page.locator("article")).toHaveCount(10);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator("article")).toHaveCount(20);
    const secondCard = page.locator(`[data-card-id="${ids[10]}"]`);
    await secondCard.scrollIntoViewIfNeeded();
    await expect.poll(() => events.find(event => event.cardId === ids[10] && event.eventType === "FEED_EXPOSURE")).toMatchObject({ resultContextId: secondContext, position: 1 });
    await page.screenshot({ path: testInfo.outputPath(`${device}-appended.png`) });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText("모든 피드를 확인했어요.")).toBeVisible();
    expect(requests).toEqual([{ limit: 10 }, { limit: 10, cursor: "page-two" }]);
    await page.getByRole("button", { name: "맨 위로 이동" }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await secondCard.getByRole("link", { name: "방문하기" }).click();
    await expect.poll(() => events.find(event => event.cardId === ids[10] && event.eventType === "FEED_CLICK")).toMatchObject({ resultContextId: secondContext, position: 1 });
  });
  test(`${device}: failed append holds scroll, retries same cursor, expiry requires restart`, async ({ page }, testInfo) => {
    const requests = []; let failed = false;
    await page.setViewportSize(viewport);
    await page.request.post(`${base}/api/e2e/persona`, { data: { persona: "owner" } });
    await page.route("**/feed-results", async route => {
      const input = route.request().postDataJSON(); requests.push(input);
      if (!input.cursor) return route.fulfill({ json: feedPage(ids.slice(0, 10), "retry-page") });
      if (!failed) { failed = true; return route.fulfill({ status: 503, json: { error: { code: "PHOTO_DELIVERY_UNAVAILABLE" } } }); }
      return route.fulfill({ status: 410, json: { error: { code: "RECOMMENDATION_CURSOR_EXPIRED" } } });
    });
    await page.goto(`${base}/feed`); await expect(page.locator("article")).toHaveCount(10);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();
    const y = await page.evaluate(() => window.scrollY); expect(y).toBeGreaterThan(0);
    await page.waitForTimeout(300); expect(requests).toHaveLength(2); await expect(page.locator("article")).toHaveCount(10);
    expect(await page.evaluate(() => window.scrollY)).toBe(y);
    await page.getByRole("button", { name: "다시 시도" }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`${device}-retry.png`) });
    await page.getByRole("button", { name: "다시 시도" }).click();
    await expect(page.getByRole("button", { name: "목록 새로 시작" })).toBeVisible();
    expect(requests[2]).toEqual(requests[1]);
    await page.getByRole("button", { name: "목록 새로 시작" }).click();
    await expect(page.locator("article")).toHaveCount(10);
    expect(requests[3]).toEqual({ limit: 10 });
  });
}
test.afterAll(async () => {
  app?.kill("SIGTERM"); backend?.closeAllConnections();
  if (backend) await new Promise(resolve => backend.close(resolve));
});
