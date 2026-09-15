import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { join } from "node:path";
export const ACCOUNT_ID = "11111111-1111-4111-8111-111111111111";
export const WISH_ID = "44444444-4444-4444-8444-444444444444";
export const SOURCE_ID = "66666666-6666-4666-8666-666666666666";
export const EVENT_ID = "55555555-5555-4555-8555-555555555555";

export async function startWishCoinApplication({ port } = {}) {
  const state = { requests: [], delay: 0, error: null };
  const backend = createServer(async (request, response) => {
    try {
      const path = new URL(request.url, "http://localhost").pathname;
      const base = `/v1/card-balance-accounts/${ACCOUNT_ID}`;
      if (path === "/v1/me/card-balance-accounts")
        return writeJson(response, 200, {
          items: [account()],
          nextCursor: null,
        });
      if (path === base) return writeJson(response, 200, account());
      if (
        request.method === "POST" &&
        (path.endsWith("/deposits") || path.endsWith("/transfers"))
      ) {
        state.requests.push({
          path,
          body: JSON.parse((await readBody(request)).toString()),
          idempotencyKey: request.headers["idempotency-key"],
        });
        const error = state.error;
        await delay(state.delay);
        if (error)
          return writeJson(response, 409, {
            error: {
              code: error,
              message: "다시 시도해 주세요",
              retryable: true,
              traceId: "coin-e2e",
              fieldErrors: [],
              details: {},
            },
          });
        return writeJson(response, 200, {
          wish: wish(WISH_ID),
          eventId: EVENT_ID,
        });
      }
      if (path.endsWith("/fund-movements"))
        return writeJson(response, 200, {
          items: [
            { eventId: EVENT_ID, wishAmountDelta: 1234, wishAmountAfter: 2234 },
          ],
          nextCursor: null,
        });
      if (path === `${base}/wishes`)
        return writeJson(response, 200, {
          items: [wish(WISH_ID), wish(SOURCE_ID)],
          nextCursor: null,
        });
      if (path === `${base}/wishes/${WISH_ID}`)
        return writeJson(response, 200, wish(WISH_ID));
      if (path === `${base}/wishes/${SOURCE_ID}`)
        return writeJson(response, 200, wish(SOURCE_ID));
      writeJson(response, 404, { error: { code: "NOT_FOUND", message: path } });
    } catch (error) {
      writeJson(response, 500, {
        error: { code: "FIXTURE_ERROR", message: String(error) },
      });
    }
  });
  await listen(backend);
  const appPort = port ?? (await availablePort());
  const url = `http://127.0.0.1:${appPort}`;
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
      env: appEnvironment(`http://127.0.0.1:${backend.address().port}`),
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  const output = captureOutput(app);
  try {
    await waitForApplication(`${url}/api/e2e/persona`, app, output);
  } catch (error) {
    await stopProcess(app);
    await closeServer(backend);
    throw error;
  }
  return {
    url,
    state,
    reset() {
      state.requests.length = 0;
      state.delay = 0;
      state.error = null;
    },
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
    actualCardBalance: 200000,
    ledgerAvailableBalance: 200000,
    displayAvailableBalance: 200000,
    unresolvedShortage: 0,
    lastRefreshStatus: "SUCCESS",
    lastRefreshedAt: "2026-09-01T00:00:00Z",
    balanceAdjustmentInProgress: false,
  };
}
function wish(id) {
  return {
    id,
    cardBalanceAccountId: ACCOUNT_ID,
    purpose: id === WISH_ID ? "노트북" : "책",
    targetAmount: 100000,
    amount: 10000,
    targetDate: null,
    state: "IN_PROGRESS",
    visibility: "PRIVATE",
    photo: null,
    balanceAdjustmentInProgress: false,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
    completedAt: null,
    closedAt: null,
    abandonmentAmount: null,
    actualDurationSeconds: null,
    version: id === WISH_ID ? 7 : 9,
  };
}
function appEnvironment(backendUrl) {
  const environment = { ...process.env };
  for (const name of [
    "AI_AGENT",
    "ANTIGRAVITY_AGENT",
    "AUGMENT_AGENT",
    "CLAUDECODE",
    "CLAUDE_CODE",
    "CLAUDE_CODE_IS_COWORK",
    "CODEX_CI",
    "CODEX_SANDBOX",
    "CODEX_THREAD_ID",
    "COPILOT_ALLOW_ALL",
    "COPILOT_GITHUB_TOKEN",
    "COPILOT_MODEL",
    "CRABIT_DEMO_TOKEN_OWNER",
    "CRABIT_DEMO_TOKEN_FRIEND",
    "CRABIT_DEMO_TOKEN_NONFRIEND",
    "CRABIT_DEMO_TOKEN_BLOCKED",
    "CRABIT_DEMO_TOKEN_OTHER_ACADEMY",
    "CRABIT_DEMO_TOKEN_STAFF",
    "CURSOR_AGENT",
    "CURSOR_EXTENSION_HOST_ROLE",
    "CURSOR_TRACE_ID",
    "GEMINI_CLI",
    "OPENCODE_CLIENT",
    "REPL_ID",
  ]) {
    delete environment[name];
  }
  return {
    ...environment,
    APP_ENV: "e2e",
    BACKEND_PROFILE: "e2e",
    BACKEND_URL: `${backendUrl}/`,
    E2E_OWNER_TOKEN: "wish-coin-owner-token",
    E2E_FRIEND_TOKEN: "wish-coin-friend-token",
    E2E_NONFRIEND_TOKEN: "wish-coin-nonfriend-token",
    E2E_BLOCKED_TOKEN: "wish-coin-blocked-token",
    E2E_OTHER_ACADEMY_TOKEN: "wish-coin-other-academy-token",
    E2E_STAFF_TOKEN: "wish-coin-staff-token",
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

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks);
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
