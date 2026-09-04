import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { join } from "node:path";

import { expect, test } from "@playwright/test";

const ACCOUNT_ID = "11111111-1111-4111-8111-111111111111";

test.describe("saved recap flow", () => {
  test.describe.configure({ mode: "serial", timeout: 60_000 });

  let application;

  test.beforeAll(async () => {
    application = await startRecapApplication();
  });

  test.afterAll(async () => {
    await application?.close();
  });

  test("renders saved recap states and keeps the selected weekly period", async ({
    page,
  }) => {
    const persona = await page.request.post(`${application.url}/api/e2e/persona`, {
      data: { persona: "owner" },
    });
    expect(persona.status()).toBe(204);

    await page.goto(application.url);

    await expect(
      page.getByRole("heading", { name: "리플레이: 저축 리포트" }),
    ).toBeVisible();
    await expect(page.getByText("지난주는 조용히 쉬어갔어요.")).toBeVisible();
    await expect(page.getByText("소액이라도 꾸준히 모았어요!")).toBeVisible();

    await page.getByRole("link", { name: "주간 리플레이 자세히 보기" }).click();

    await expect(page).toHaveURL((url) => {
      return (
        url.pathname === "/recaps/weekly" &&
        url.searchParams.get("weekStart") === "2026-08-24"
      );
    });
    await expect(page.getByRole("heading", { name: "주간 리플레이" })).toBeVisible();
    await expect(
      page.getByRole("paragraph").filter({ hasText: "저축 횟수0번" }),
    ).toBeVisible();
    expect(application.weekStarts).toContain("2026-08-24");
  });
});

async function startRecapApplication() {
  const weekStarts = [];
  const backend = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://recap.test");
    if (request.method === "GET" && url.pathname === "/v1/me/card-balance-accounts") {
      writeJson(response, 200, { items: [account()], nextCursor: null });
      return;
    }
    if (
      request.method === "GET" &&
      url.pathname ===
        `/v1/card-balance-accounts/${ACCOUNT_ID}/representative-wish`
    ) {
      response.writeHead(204).end();
      return;
    }
    if (
      request.method === "GET" &&
      url.pathname === `/v1/card-balance-accounts/${ACCOUNT_ID}/recaps/weekly`
    ) {
      const weekStart = url.searchParams.get("weekStart");
      if (weekStart !== null) weekStarts.push(weekStart);
      writeJson(response, 200, weeklyRecap());
      return;
    }
    if (
      request.method === "GET" &&
      url.pathname === `/v1/card-balance-accounts/${ACCOUNT_ID}/recaps/monthly`
    ) {
      writeJson(response, 200, monthlyRecap());
      return;
    }
    writeJson(response, 404, {
      error: { code: "NOT_FOUND", message: url.pathname },
    });
  });
  await listen(backend);

  const backendAddress = backend.address();
  if (backendAddress === null || typeof backendAddress === "string") {
    throw new Error("Recap backend did not bind to a TCP port");
  }
  const appPort = await availablePort();
  const appUrl = `http://127.0.0.1:${appPort}`;
  const app = spawn(
    process.execPath,
    [
      join(process.cwd(), "node_modules/next/dist/bin/next"),
      "dev",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(appPort),
    ],
    {
      cwd: process.cwd(),
      env: appEnvironment(`http://127.0.0.1:${backendAddress.port}`),
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  const output = captureOutput(app);

  try {
    await waitForApplication(`${appUrl}/api/e2e/persona`, app, output);
  } catch (error) {
    await stopProcess(app);
    await closeServer(backend);
    throw error;
  }

  return {
    url: appUrl,
    weekStarts,
    async close() {
      await stopProcess(app);
      await closeServer(backend);
    },
  };
}

function account() {
  return {
    cardBalanceAccountId: ACCOUNT_ID,
    academyId: "22222222-2222-4222-8222-222222222222",
    balanceKnowledge: "KNOWN",
    actualCardBalance: 200_000,
    ledgerAvailableBalance: 200_000,
    displayAvailableBalance: 200_000,
    unresolvedShortage: 0,
    lastRefreshStatus: "SUCCESS",
    lastRefreshedAt: "2026-09-01T00:00:00Z",
    balanceAdjustmentInProgress: false,
  };
}

function weeklyRecap() {
  return {
    kind: "WEEKLY",
    status: "SUCCEEDED",
    period: period("2026-08-24", "2026-08-31"),
    generationVersion: 1,
    schemaVersion: 1,
    algorithmVersion: "recap-1",
    generatedAt: "2026-08-31T00:05:00Z",
    result: {
      period: { weekStart: "2026-08-24", weekEnd: "2026-08-30" },
      page1LastWeekPerformance: {
        achievement: {
          saveCount: 0,
          netSavings: 0,
          newWishCount: 0,
          message: "지난주는 조용히 쉬어갔어요.",
        },
        milestone: {
          wishTitle: null,
          rateBefore: null,
          rateAfter: null,
          message: null,
        },
        streak: { streakWeeks: 0, message: "새로운 스트릭을 시작해 보세요." },
      },
      page2GrowthReport: {
        totalVisits: 0,
        uniqueVisitors: 0,
        growthPct: null,
        messageVisits: "지난주엔 방문한 친구가 없었어요.",
        messageGrowth: null,
      },
      page3AcademySuccessStories: {
        messageSummary: "아직 성공 스토리가 없어요.",
        stories: [],
      },
    },
  };
}

function monthlyRecap() {
  return {
    kind: "MONTHLY",
    status: "SUCCEEDED",
    period: period("2026-08-01", "2026-09-01"),
    generationVersion: 1,
    schemaVersion: 1,
    algorithmVersion: "recap-1",
    generatedAt: "2026-09-01T00:10:00Z",
    result: {
      period: { year: 2026, month: 8 },
      isActive: true,
      typeSection: {
        typeTitle: "꾸준형 토끼",
        message: "소액이라도 꾸준히 모았어요!",
      },
      objectivePerformance: {
        totalSavings: 0,
        completedWishCount: 0,
        representativeWishTitle: null,
        prevRatePct: null,
        currRatePct: null,
        messageTotalSavings: "이번 달 저축은 0원이에요.",
        messageCompletedCount: "완주한 위시가 없어요.",
        messageRateChange: null,
      },
      patternAnalysis: {
        topWeek: null,
        topWeekday: null,
        messageWeekWeekday: "저축 기록이 충분하지 않아요.",
        messageRegularity: "저축 간격을 계산할 수 없어요.",
        messageAvgAmount: "평균 금액을 계산할 수 없어요.",
      },
      groupComparison: {
        habitPercentile: null,
        habitPercentileStatus: "no_peers",
        achievementPercentile: null,
        achievementPercentileStatus: null,
        messageHabit: "아직 비교할 친구가 없어요.",
        messageAchievement: null,
      },
      pacePrediction: {
        dailyPace: 0,
        expectedCompletionDate: null,
        requiredDailyAmount: null,
        messageDailyPace: "저축 속도는 하루 평균 0원이에요.",
        messageExpectedDate: null,
        messageRequiredDaily: null,
      },
    },
  };
}

function period(startDate, endDateExclusive) {
  return { startDate, endDateExclusive, timezone: "Asia/Seoul" };
}

function appEnvironment(backendUrl) {
  const environment = { ...process.env };
  for (const name of [
    "AI_AGENT",
    "CLAUDECODE",
    "CLAUDE_CODE",
    "CODEX_CI",
    "CODEX_SANDBOX",
    "CODEX_THREAD_ID",
    "CURSOR_AGENT",
    "GEMINI_CLI",
  ]) {
    delete environment[name];
  }
  return {
    ...environment,
    APP_ENV: "e2e",
    BACKEND_PROFILE: "e2e",
    BACKEND_URL: `${backendUrl}/`,
    E2E_OWNER_TOKEN: "recap-owner-token",
    E2E_FRIEND_TOKEN: "recap-friend-token",
    E2E_NONFRIEND_TOKEN: "recap-nonfriend-token",
    E2E_BLOCKED_TOKEN: "recap-blocked-token",
    E2E_OTHER_ACADEMY_TOKEN: "recap-other-academy-token",
    E2E_STAFF_TOKEN: "recap-staff-token",
    NEXT_TELEMETRY_DISABLED: "1",
  };
}

function captureOutput(child) {
  const chunks = [];
  const capture = (chunk) => {
    chunks.push(chunk.toString("utf8"));
    while (chunks.length > 40) chunks.shift();
  };
  child.stdout?.on("data", capture);
  child.stderr?.on("data", capture);
  return () => chunks.join("").slice(-8_000);
}

async function waitForApplication(url, child, output) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Next exited before startup\n${output()}`);
    }
    try {
      await fetch(url);
      return;
    } catch {
      await delay(200);
    }
  }
  throw new Error(`Timed out waiting for Next\n${output()}`);
}

async function availablePort() {
  const reservation = createServer();
  await listen(reservation);
  const address = reservation.address();
  if (address === null || typeof address === "string") {
    throw new Error("Port reservation did not bind to TCP");
  }
  const { port } = address;
  await closeServer(reservation);
  return port;
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
}

async function closeServer(server) {
  if (!server.listening) return;
  server.closeAllConnections?.();
  await new Promise((resolve, reject) =>
    server.close((error) => (error === undefined ? resolve() : reject(error))),
  );
}

async function stopProcess(child) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([once(child, "exit"), delay(5_000)]);
  if (child.exitCode === null) {
    child.kill("SIGKILL");
    await once(child, "exit");
  }
}

function writeJson(response, status, value) {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(value));
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
