import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { join } from "node:path";

export const ACCOUNT_ID = "11111111-1111-4111-8111-111111111111";
const ACADEMY_ID = "22222222-2222-4222-8222-222222222222";
const PHOTO_ID = "33333333-3333-4333-8333-333333333333";
const WISH_ID = "44444444-4444-4444-8444-444444444444";
const EVENT_ID = "55555555-5555-4555-8555-555555555555";
const PHOTO_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

export const WISH_PHOTO_INPUT = {
  name: "wish.png",
  mimeType: "image/png",
  buffer: PHOTO_BYTES,
};

export async function startWishPhotoApplication() {
  const state = {
    uploads: [],
    creations: [],
    wishes: new Map(),
  };
  const backend = createServer((request, response) => {
    handleBackendRequest(request, response, state).catch((error) => {
      writeJson(response, 500, {
        error: {
          code: "WISH_PHOTO_E2E_BACKEND_FAILURE",
          message: error instanceof Error ? error.message : "Unknown failure",
        },
      });
    });
  });
  await listen(backend);

  const backendAddress = backend.address();
  if (backendAddress === null || typeof backendAddress === "string") {
    throw new Error("Wish photo backend did not bind to a TCP port");
  }
  const backendUrl = `http://127.0.0.1:${backendAddress.port}`;
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
      env: appEnvironment(backendUrl),
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
    state,
    reset() {
      state.uploads.length = 0;
      state.creations.length = 0;
      state.wishes.clear();
    },
    async close() {
      await stopProcess(app);
      await closeServer(backend);
    },
  };
}

async function handleBackendRequest(request, response, state) {
  const url = new URL(request.url ?? "/", "http://wish-photo.test");
  if (request.method === "GET" && url.pathname === "/v1/me/card-balance-accounts") {
    writeJson(response, 200, { items: [account()], nextCursor: null });
    return;
  }

  if (
    request.method === "GET" &&
    url.pathname === `/v1/card-balance-accounts/${ACCOUNT_ID}`
  ) {
    writeJson(response, 200, account());
    return;
  }

  if (request.method === "POST" && url.pathname === "/v1/wish-photos") {
    const bytes = await readBody(request);
    const contentType = request.headers["content-type"] ?? "";
    state.uploads.push({
      contentType,
      idempotencyKey: request.headers["idempotency-key"] ?? null,
      bytes,
    });
    writeJson(response, 201, photo(backendOrigin(request)));
    return;
  }

  if (
    request.method === "POST" &&
    url.pathname === `/v1/card-balance-accounts/${ACCOUNT_ID}/wishes`
  ) {
    const body = JSON.parse((await readBody(request)).toString("utf8"));
    const created = wish(body, backendOrigin(request));
    state.creations.push({
      accountId: ACCOUNT_ID,
      authorization: request.headers.authorization ?? null,
      idempotencyKey: request.headers["idempotency-key"] ?? null,
      body,
    });
    state.wishes.set(created.id, created);
    writeJson(response, 201, { wish: created, eventId: EVENT_ID });
    return;
  }

  const detail = /^\/v1\/card-balance-accounts\/([^/]+)\/wishes\/([^/]+)$/.exec(
    url.pathname,
  );
  if (request.method === "GET" && detail !== null) {
    const [, accountId, wishId] = detail;
    const stored = state.wishes.get(wishId);
    if (accountId === ACCOUNT_ID && stored !== undefined) {
      writeJson(response, 200, stored);
    } else {
      writeJson(response, 404, {
        error: {
          code: "WISH_NOT_FOUND",
          message: "Wish not found",
          retryable: false,
          traceId: "wish-photo-e2e",
          fieldErrors: [],
          details: {},
        },
      });
    }
    return;
  }

  if (request.method === "GET" && url.pathname === "/wish-photo.png") {
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": "image/png",
    });
    response.end(PHOTO_BYTES);
    return;
  }

  writeJson(response, 404, {
    error: { code: "NOT_FOUND", message: url.pathname },
  });
}

function account() {
  return {
    cardBalanceAccountId: ACCOUNT_ID,
    academyId: ACADEMY_ID,
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

function photo(origin) {
  return {
    id: PHOTO_ID,
    variants: {
      small: `${origin}/wish-photo.png`,
      medium: `${origin}/wish-photo.png`,
      large: `${origin}/wish-photo.png`,
    },
    expiresAt: "2026-09-01T00:05:00Z",
  };
}

function wish(body, origin) {
  return {
    id: WISH_ID,
    cardBalanceAccountId: ACCOUNT_ID,
    purpose: body.purpose,
    targetAmount: body.targetAmount,
    amount: 0,
    targetDate: body.targetDate,
    state: "IN_PROGRESS",
    visibility: "PRIVATE",
    photo: body.photoId === PHOTO_ID ? photo(origin) : null,
    balanceAdjustmentInProgress: false,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
    completedAt: null,
    closedAt: null,
    actualDurationSeconds: null,
    version: 0,
  };
}

function backendOrigin(request) {
  return `http://${request.headers.host}`;
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
    E2E_OWNER_TOKEN: "wish-photo-owner-token",
    E2E_FRIEND_TOKEN: "wish-photo-friend-token",
    E2E_NONFRIEND_TOKEN: "wish-photo-nonfriend-token",
    E2E_BLOCKED_TOKEN: "wish-photo-blocked-token",
    E2E_OTHER_ACADEMY_TOKEN: "wish-photo-other-academy-token",
    E2E_STAFF_TOKEN: "wish-photo-staff-token",
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
