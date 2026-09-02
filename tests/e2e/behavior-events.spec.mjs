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
test("appended result pages preserve page-local positions and refresh replaces their contexts", async ({
  page,
}) => {
  multiPage = true;
  await page.request.post(`${base}/api/e2e/persona`, {
    data: { persona: "owner" },
  });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto(`${base}/feed`);
  await expect(page.locator(`[data-card-id="${card}"]`)).toBeVisible();
  await page.getByRole("button", { name: "더 보기" }).click();
  const second = page.locator(`[data-card-id="${card2}"]`);
  await second.scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        events.filter(
          (event) =>
            event.cardId === card2 && event.eventType === "FEED_EXPOSURE",
        ).length,
    )
    .toBe(1);
  const secondPage = results.find(
    (result) => result.input.cursor === "second-page",
  );
  const exposure = events.find(
    (event) => event.cardId === card2 && event.eventType === "FEED_EXPOSURE",
  );
  expect(exposure.resultContextId).toBe(secondPage.resultContextId);
  expect(exposure.position).toBe(0);
  const oldContexts = results.map((result) => result.resultContextId);
  await page.getByRole("button", { name: "새로고침" }).click();
  await expect(page.locator("article")).toHaveCount(1);
  await expect.poll(() => results.length).toBe(3);
  expect(oldContexts).not.toContain(results[2].resultContextId);
});

test("academy and Persona A-to-B-to-A switching rejects original contexts before upstream", async ({
  page,
}) => {
  await page.request.post(`${base}/api/e2e/persona`, {
    data: { persona: "owner" },
  });
  await page.goto(`${base}/feed`);
  await expect(page.locator("article")).toHaveCount(1);
  const original = await (
    await page.request.post(`${base}/api/behavior/context`, {
      data: { academyId: academy },
    })
  ).json();
  await page.getByRole("combobox").selectOption(academy2);
  await expect
    .poll(() => results.at(-1)?.path)
    .toBe(`/v1/academies/${academy2}/feed-results`);
  await page.getByRole("combobox").selectOption(academy);
  await expect
    .poll(() => results.at(-1)?.path)
    .toBe(`/v1/academies/${academy}/feed-results`);
  const body = {
    eventId: randomUUID(),
    targetStudentId: student,
    occurredAt: new Date().toISOString(),
  };
  const stale = () =>
    page.request.post(
      `${base}/api/backend/v1/academies/${academy}/profile-visits`,
      {
        headers: { "X-Crabit-Behavior-Context": original.contextId },
        data: body,
      },
    );
  expect((await stale()).status()).toBe(409);
  expect(
    events.filter((event) => event.path.endsWith("profile-visits")),
  ).toHaveLength(0);
  for (const persona of ["friend", "owner"])
    await page.request.post(`${base}/api/e2e/persona`, { data: { persona } });
  expect((await stale()).status()).toBe(409);
  expect(
    events.filter((event) => event.path.endsWith("profile-visits")),
  ).toHaveLength(0);
  await page.getByRole("button", { name: "새로고침" }).click();
  await expect(page.locator("article")).toHaveCount(1);
  await page.getByRole("link", { name: "방문하기" }).click();
  await expect
    .poll(
      () =>
        events.filter((event) => event.path.endsWith("profile-visits")).length,
    )
    .toBe(1);
  expect(
    events.find((event) => event.path.endsWith("profile-visits")).authorization,
  ).toBe("Bearer fixture-owner");
});

test("a failed destination emits its click but no profile visit", async ({
  page,
}) => {
  unavailableStudent = true;
  await page.request.post(`${base}/api/e2e/persona`, {
    data: { persona: "owner" },
  });
  await page.goto(`${base}/feed`);
  await page.getByRole("link", { name: "방문하기" }).click();
  await expect(
    page.getByText("이 학생의 프로필을 볼 수 없어요.", { exact: true }),
  ).toBeVisible();
  await expect
    .poll(
      () => events.filter((event) => event.eventType === "FEED_CLICK").length,
    )
    .toBe(1);
  expect(
    events.filter((event) => event.path.endsWith("profile-visits")),
  ).toHaveLength(0);
});

test("a late read-context mismatch cannot restart the newly selected academy", async ({ page }) => {
  await page.request.post(`${base}/api/e2e/persona`, { data: { persona: "owner" } });
  let delayed;
  let release;
  const released = new Promise(resolve => { release = resolve; });
  const contextRequests = [];
  page.on("request", request => {
    if (request.url().endsWith("/api/behavior/context")) contextRequests.push(request);
  });
  await page.route(`**/api/backend/v1/academies/${academy}/feed-results`, async route => {
    delayed = route;
    await released;
    await route.fulfill({ status: 409, contentType: "application/json", body: JSON.stringify({ code: "BEHAVIOR_CONTEXT_MISMATCH" }) });
  });
  await page.goto(`${base}/feed`);
  await expect.poll(() => Boolean(delayed)).toBe(true);
  await page.getByRole("combobox").selectOption(academy2);
  await expect(page.locator("article")).toHaveCount(1);
  expect(contextRequests).toHaveLength(2);
  release();
  await page.waitForResponse(response => response.url().includes(`/academies/${academy}/feed-results`) && response.status() === 409);
  await page.waitForTimeout(300);
  await expect(page.getByRole("combobox")).toHaveValue(academy2);
  expect(contextRequests).toHaveLength(2);
  expect(results).toHaveLength(1);
});

test("tracking failures preserve navigation and retry the same profile event four times", async ({
  page,
}) => {
  test.setTimeout(20000);
  rejectEvents = true;
  await page.request.post(`${base}/api/e2e/persona`, {
    data: { persona: "owner" },
  });
  await page.goto(`${base}/feed`);
  await page.getByRole("link", { name: "방문하기" }).click();
  await expect(
    page.getByRole("heading", { name: "실제 학생", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("공유한 위시가 없어요.")).toBeVisible();
  await expect
    .poll(
      () =>
        events.filter((event) => event.path.endsWith("profile-visits")).length,
      { timeout: 12000 },
    )
    .toBe(4);
  const visits = events.filter((event) =>
    event.path.endsWith("profile-visits"),
  );
  expect(new Set(visits.map((event) => JSON.stringify(event))).size).toBe(1);
});
test.afterAll(async () => {
  app?.kill("SIGTERM");
  backend?.closeAllConnections();
  if (backend) await new Promise((resolve) => backend.close(resolve));
});
test("real Next navigation emits a dwell exposure, click, one visit and distinct reload/back visits", async ({
  page,
}) => {
  test.setTimeout(30000);
  await page.request.post(`${base}/api/e2e/persona`, {
    data: { persona: "owner" },
  });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto(`${base}/feed`);
  await expect(page.getByText("실제 학생의 위시리스트")).toBeVisible();
  await page.locator("article").scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        events.filter((event) => event.eventType === "FEED_EXPOSURE").length,
    )
    .toBe(1);
  expect(
    events.filter((event) => event.path.endsWith("profile-visits")),
  ).toHaveLength(0);
  await page.getByRole("link", { name: "방문하기" }).click();
  await expect(
    page.getByRole("heading", { name: "실제 학생", exact: true }),
  ).toBeVisible();
  await expect
    .poll(
      () =>
        events.filter((event) => event.path.endsWith("profile-visits")).length,
    )
    .toBe(1);
  await expect(page.getByText("공유한 위시가 없어요.")).toBeVisible();
  expect(
    events.filter((event) => event.eventType === "FEED_CLICK"),
  ).toHaveLength(1);
  await page.reload();
  await expect
    .poll(
      () =>
        events.filter((event) => event.path.endsWith("profile-visits")).length,
    )
    .toBe(2);
  await page.getByRole("link", { name: "뒤로 가기" }).click();
  await expect(page.getByText("실제 학생의 위시리스트")).toBeVisible();
  await page.goBack();
  await expect
    .poll(
      () =>
        events.filter((event) => event.path.endsWith("profile-visits")).length,
    )
    .toBe(3);
  const visits = events.filter((event) =>
    event.path.endsWith("profile-visits"),
  );
  expect(new Set(visits.map((event) => event.eventId)).size).toBe(3);
});
