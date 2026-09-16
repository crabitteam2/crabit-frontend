import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";

export async function startMonthlyApp() {
  const upstream = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    let body;
    if (url.pathname.endsWith("/card-balance-accounts")) {
      body = { items: [{ cardBalanceAccountId: "selector-account" }] };
    } else if (url.pathname.endsWith("/wishes")) {
      body = {
        items: [{ createdAt: "2024-01-01T00:00:00Z" }],
        nextCursor: null,
      };
    } else if (url.pathname.endsWith("/recaps/monthly")) {
      const month = url.searchParams.get("month") ?? "2025-08";
      const number = Number(month.slice(5));
      const status =
        number === 6 || number === 7
          ? "NOT_ELIGIBLE"
          : number === 9
            ? "NOT_GENERATED"
            : "SUCCEEDED";
      await new Promise((resolve) =>
        setTimeout(resolve, number === 4 ? 700 : 100),
      );
      const messages = (keys) =>
        Object.fromEntries(keys.map((key) => [key, null]));
      body = {
        kind: "MONTHLY",
        status,
        schemaVersion: 1,
        algorithmVersion: "test",
        generationVersion: 1,
        generatedAt: null,
        period: {
          startDate: `${month}-01`,
          endDateExclusive: `${number === 12 ? Number(month.slice(0, 4)) + 1 : month.slice(0, 4)}-${String((number % 12) + 1).padStart(2, "0")}-01`,
          timezone: "Asia/Seoul",
        },
        result:
          status === "SUCCEEDED"
            ? {
                period: { year: Number(month.slice(0, 4)), month: number },
                isActive: true,
                typeSection: {
                  typeTitle: "꾸준형",
                  message: `${month} 저축 결과`,
                },
                objectivePerformance: messages([
                  "messageTotalSavings",
                  "messageCompletedCount",
                  "messageRateChange",
                ]),
                patternAnalysis: messages([
                  "messageWeekWeekday",
                  "messageRegularity",
                  "messageAvgAmount",
                ]),
                groupComparison: messages([
                  "messageHabit",
                  "messageAchievement",
                ]),
                pacePrediction: messages([
                  "messageDailyPace",
                  "messageExpectedDate",
                  "messageRequiredDaily",
                ]),
              }
            : null,
      };
    } else {
      res.writeHead(404).end();
      return;
    }
    res
      .writeHead(200, { "Content-Type": "application/json" })
      .end(JSON.stringify(body));
  });
  upstream.listen(0, "127.0.0.1");
  await once(upstream, "listening");
  const port = 3190;
  const child = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "dev",
      "--webpack",
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
        BACKEND_URL: `http://127.0.0.1:${upstream.address().port}/`,
        E2E_OWNER_TOKEN: "selector-test",
        E2E_FRIEND_TOKEN: "test-friend",
        E2E_NONFRIEND_TOKEN: "test-nonfriend",
        E2E_BLOCKED_TOKEN: "test-blocked",
        E2E_OTHER_ACADEMY_TOKEN: "test-other_academy",
        E2E_STAFF_TOKEN: "test-staff",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let output = "";
  child.stdout.on("data", (d) => (output += d));
  child.stderr.on("data", (d) => (output += d));
  const url = `http://127.0.0.1:${port}`;
  async function close() {
    upstream.closeAllConnections();
    await new Promise((resolve) => upstream.close(resolve));
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, "exit");
      child.kill("SIGTERM");
      const force = setTimeout(() => child.kill("SIGKILL"), 5000);
      force.unref();
      try {
        await exited;
      } finally {
        clearTimeout(force);
      }
    }
  }
  try {
    for (let i = 0; i < 120; i++) {
      if (child.exitCode !== null || child.signalCode !== null)
        throw new Error(output);
      if (output.includes("Ready")) {
        try {
          const response = await fetch(`${url}/api/e2e/persona`, {
            signal: AbortSignal.timeout(1000),
          });
          if (response.status < 500) return { url, close };
        } catch {}
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error(output);
  } catch (error) {
    await close();
    throw error;
  }
}
