import { execFile, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { access } from "node:fs/promises";
import { createServer } from "node:http";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

import { expect, test } from "@playwright/test";

const execFileAsync = promisify(execFile);
const ACCOUNT_ID = "00000000-0000-0000-0000-000000000301";
const STUDENT_ID = "00000000-0000-0000-0000-000000000201";
const ACADEMY_ID = "00000000-0000-0000-0000-000000000101";
const WISH_ID = "00000000-0000-0000-0000-000000000401";
const WEEKLY_GENERATION_ID = "00000000-0000-4000-8000-00000000e201";
const MONTHLY_GENERATION_ID = "00000000-0000-4000-8000-00000000e202";
const DATABASE_NAME = "crabit_e2e";
const DATABASE_USER = "crabit";
const DATABASE_PASSWORD = "recap-e2e-password";
const RECAP_TOKEN = "recap-e2e-service-token";

test.describe("real saved recap flow", () => {
  test.describe.configure({ mode: "serial", timeout: 240_000 });

  let application;

  test.beforeAll(async () => {
    test.setTimeout(240_000);
    application = await startRecapApplication();
  });

  test.afterAll(async () => {
    test.setTimeout(30_000);
    await application?.close();
  });

  test("generates weekly and qualifying monthly recaps, persists them, and renders them for only the owner", async ({
    page,
  }) => {
    expect(application.databaseEvidence).toEqual([
      {
        kind: "MONTHLY",
        state: "SUCCEEDED",
        attempts: 1,
        current: true,
        stored: true,
      },
      {
        kind: "WEEKLY",
        state: "SUCCEEDED",
        attempts: 1,
        current: true,
        stored: true,
      },
    ]);
    expect(countSuccessfulPythonRequests(application.pythonOutput())).toBe(2);

    await selectPersona(page, application.url, "owner");

    const weeklyResponse = await page.request.get(
      `${application.url}/api/backend/v1/card-balance-accounts/${ACCOUNT_ID}/recaps/weekly?weekStart=2026-08-24`,
    );
    expect(weeklyResponse.status()).toBe(200);
    const weekly = await weeklyResponse.json();
    expect(weekly).toMatchObject({
      kind: "WEEKLY",
      status: "SUCCEEDED",
      generationVersion: 1,
      result: {
        period: { weekStart: "2026-08-24", weekEnd: "2026-08-30" },
        page1LastWeekPerformance: { achievement: { saveCount: 1 } },
      },
    });

    const monthlyResponse = await page.request.get(
      `${application.url}/api/backend/v1/card-balance-accounts/${ACCOUNT_ID}/recaps/monthly?month=2026-08`,
    );
    expect(monthlyResponse.status()).toBe(200);
    const monthly = await monthlyResponse.json();
    expect(monthly).toMatchObject({
      kind: "MONTHLY",
      status: "SUCCEEDED",
      generationVersion: 1,
      result: { period: { year: 2026, month: 8 }, isActive: true },
    });

    await page.goto(application.url);
    await expect(
      page.getByRole("heading", { name: "리플레이: 저축 리포트" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        weekly.result.page1LastWeekPerformance.achievement.message,
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      page.getByText(monthly.result.typeSection.message, { exact: true }),
    ).toBeVisible();

    await page.getByRole("link", { name: "주간 리플레이 자세히 보기" }).click();
    await expect(page).toHaveURL((url) => {
      return (
        url.pathname === "/recaps/weekly" &&
        url.searchParams.get("weekStart") === "2026-08-24"
      );
    });
    await expect(page.getByRole("heading", { name: "주간 리플레이" })).toBeVisible();
    await expect(page.getByText("저축 횟수1번", { exact: true })).toBeVisible();

    await page.goto(application.url);
    await page.getByRole("link", { name: "월간 리플레이 자세히 보기" }).click();
    await expect(page).toHaveURL((url) => {
      return (
        url.pathname === "/recaps/monthly" &&
        url.searchParams.get("month") === "2026-08"
      );
    });
    await expect(page.getByRole("heading", { name: "월간 리플레이" })).toBeVisible();
    await expect(
      page.getByText(monthly.result.typeSection.message, { exact: true }),
    ).toBeVisible();

    await selectPersona(page, application.url, "friend");
    const denied = await page.request.get(
      `${application.url}/api/backend/v1/card-balance-accounts/${ACCOUNT_ID}/recaps/weekly?weekStart=2026-08-24`,
    );
    expect(denied.status()).toBe(404);
    await expect(denied.json()).resolves.toMatchObject({
      error: { code: "CARD_BALANCE_ACCOUNT_NOT_FOUND" },
    });
  });
});

async function startRecapApplication() {
  const roots = await repositoryRoots();
  const resources = [];
  try {
    console.log("[recap-e2e] starting PostgreSQL");
    const postgres = await startPostgres();
    resources.push(postgres);

    console.log("[recap-e2e] starting Python recap service");
    const python = await startPythonService(roots.data);
    resources.push(python);

    console.log("[recap-e2e] starting backend");
    const backend = await startBackend(roots.backend, postgres, python.url);
    resources.push(backend);

    console.log("[recap-e2e] inserting signed generation requests");
    const requests = await generationRequests(roots.data);
    await insertPendingGenerations(postgres, requests);
    const databaseEvidence = await waitForStoredRecaps(postgres, backend);

    console.log("[recap-e2e] starting frontend");
    const frontend = await startFrontend(backend.url);
    resources.push(frontend);

    return {
      url: frontend.url,
      databaseEvidence,
      pythonOutput: python.output,
      async close() {
        await closeResources(resources);
      },
    };
  } catch (error) {
    await closeResources(resources);
    throw error;
  }
}

async function repositoryRoots() {
  const featureRoot = resolve(process.cwd(), "..");
  const roots = {
    backend: resolve(
      process.env.CRABIT_RECAP_BACKEND_DIR ?? join(featureRoot, "crabit-backend"),
    ),
    data: resolve(
      process.env.CRABIT_RECAP_DATA_DIR ?? join(featureRoot, "crabit-data"),
    ),
  };
  await Promise.all([
    access(join(roots.backend, "gradlew")),
    access(join(roots.data, "recap_service", "__main__.py")),
  ]);
  return roots;
}

async function startPostgres() {
  const name = `crabit-recap-e2e-${process.pid}-${randomUUID().slice(0, 8)}`;
  await runCommand("docker", [
    "run",
    "--rm",
    "--detach",
    "--name",
    name,
    "--env",
    `POSTGRES_DB=${DATABASE_NAME}`,
    "--env",
    `POSTGRES_USER=${DATABASE_USER}`,
    "--env",
    `POSTGRES_PASSWORD=${DATABASE_PASSWORD}`,
    "--publish",
    "127.0.0.1::5432",
    "postgres:16-alpine",
  ]);

  const postgres = {
    name,
    port: null,
    async close() {
      await runCommand("docker", ["stop", "--time", "2", name], {
        allowFailure: true,
      });
    },
  };

  try {
    await waitUntil(
      async () => {
        const result = await runCommand(
          "docker",
          ["exec", name, "pg_isready", "-U", DATABASE_USER, "-d", DATABASE_NAME],
          { allowFailure: true },
        );
        return result.exitCode === 0;
      },
      30_000,
      "PostgreSQL readiness",
    );
    const mapping = await runCommand("docker", ["port", name, "5432/tcp"]);
    const match = mapping.stdout.trim().match(/:(\d+)$/);
    if (match === null) throw new Error(`Unexpected Docker port mapping: ${mapping.stdout}`);
    postgres.port = Number(match[1]);
    return postgres;
  } catch (error) {
    await postgres.close();
    throw error;
  }
}

async function startPythonService(dataRoot) {
  const child = spawnTracked("python3", ["-m", "recap_service"], {
    cwd: dataRoot,
    env: {
      ...cleanEnvironment(),
      CRABIT_RECAP_HOST: "127.0.0.1",
      CRABIT_RECAP_PORT: "0",
      CRABIT_RECAP_TOKEN: RECAP_TOKEN,
      PYTHONUNBUFFERED: "1",
    },
  });
  const output = captureOutput(child);
  try {
    const ready = await waitForJsonEvent(child, output, "recap-service-ready", 15_000);
    return {
      url: ready.url,
      output,
      async close() {
        await stopProcess(child);
      },
    };
  } catch (error) {
    await stopProcess(child);
    throw error;
  }
}

async function startBackend(backendRoot, postgres, pythonUrl) {
  const port = await availablePort();
  const url = `http://127.0.0.1:${port}`;
  const applicationArguments = [
    "--spring.profiles.active=e2e",
    "--server.address=127.0.0.1",
    `--server.port=${port}`,
    `--spring.datasource.url=jdbc:postgresql://127.0.0.1:${postgres.port}/${DATABASE_NAME}`,
    `--spring.datasource.username=${DATABASE_USER}`,
    `--spring.datasource.password=${DATABASE_PASSWORD}`,
    "--crabit.e2e.seed.reset-on-startup=true",
    "--crabit.recap.generation.enabled=true",
    `--crabit.recap.generation.url=${pythonUrl}/internal/v1/recap-generations`,
    `--crabit.recap.generation.credential=${RECAP_TOKEN}`,
    "--crabit.recap.generation.poll-delay-ms=200",
  ];
  const child = spawnTracked(
    "./gradlew",
    ["--no-daemon", "bootRun", `--args=${applicationArguments.join(" ")}`],
    { cwd: backendRoot, env: cleanEnvironment() },
  );
  const output = captureOutput(child);
  try {
    await waitForHttp(`${url}/actuator/health/readiness`, child, output, 120_000);
    return {
      url,
      output,
      async close() {
        await stopProcess(child);
      },
    };
  } catch (error) {
    await stopProcess(child);
    throw error;
  }
}

async function startFrontend(backendUrl) {
  const port = await availablePort();
  const url = `http://127.0.0.1:${port}`;
  const child = spawnTracked(
    process.execPath,
    [
      join(process.cwd(), "node_modules/next/dist/bin/next"),
      "dev",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      cwd: process.cwd(),
      env: {
        ...cleanEnvironment(),
        APP_ENV: "e2e",
        BACKEND_PROFILE: "e2e",
        BACKEND_URL: `${backendUrl}/`,
        E2E_OWNER_TOKEN: "seed-owner-token",
        E2E_FRIEND_TOKEN: "seed-friend-token",
        E2E_NONFRIEND_TOKEN: "seed-nonfriend-token",
        E2E_BLOCKED_TOKEN: "seed-blocked-token",
        E2E_OTHER_ACADEMY_TOKEN: "seed-other-academy-token",
        E2E_STAFF_TOKEN: "seed-staff-token",
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  );
  const output = captureOutput(child);
  try {
    await waitForHttp(`${url}/api/e2e/persona`, child, output, 45_000);
    return {
      url,
      output,
      async close() {
        await stopProcess(child);
      },
    };
  } catch (error) {
    await stopProcess(child);
    throw error;
  }
}

async function generationRequests(dataRoot) {
  const weekly = requestFor("WEEKLY", WEEKLY_GENERATION_ID, [
    transaction("00000000-0000-4000-8000-00000000f101", "2026-08-25T03:00:00Z", 5_000),
  ]);
  const monthly = requestFor("MONTHLY", MONTHLY_GENERATION_ID, [
    transaction("00000000-0000-4000-8000-00000000f201", "2026-08-02T03:00:00Z", 1_000),
    transaction("00000000-0000-4000-8000-00000000f202", "2026-08-09T03:00:00Z", 1_000),
    transaction("00000000-0000-4000-8000-00000000f203", "2026-08-16T03:00:00Z", 1_000),
  ]);
  await Promise.all([signRequest(weekly, dataRoot), signRequest(monthly, dataRoot)]);
  return [weekly, monthly];
}

function requestFor(kind, generationId, transactions) {
  const monthly = kind === "MONTHLY";
  const depositTotal = transactions.reduce((sum, item) => sum + item.amount, 0);
  return {
    schema_version: 1,
    algorithm_version: "recap-1",
    generation_id: generationId,
    input_digest: "",
    student_id: STUDENT_ID,
    card_balance_account_id: ACCOUNT_ID,
    academy_id: ACADEMY_ID,
    kind,
    period: {
      start_date: monthly ? "2026-08-01" : "2026-08-24",
      end_date_exclusive: monthly ? "2026-09-01" : "2026-08-31",
      timezone: "Asia/Seoul",
    },
    reference_date: monthly ? "2026-08-31" : "2026-08-30",
    snapshot_at: "2026-09-01T00:05:00Z",
    input: {
      representative_wish_id: WISH_ID,
      wishes: [
        {
          wish_id: WISH_ID,
          title: "노트북",
          target_amount: 1_500_000,
          created_at: "2026-07-01T00:00:00Z",
          closed_at: null,
          deleted_at: null,
          status: "IN_PROGRESS",
          is_representative: true,
          saved_amount_at_period_end: 250_000 + depositTotal,
        },
      ],
      effective_transactions: transactions,
      visit_metrics: {
        received_visit_count: 0,
        unique_received_visitor_count: 0,
        previous_week_received_visit_count: 0,
        monthly_outgoing_visit_count: 0,
      },
      peer_metrics: { habit_active_weeks: [], achievement_rates: [] },
      success_story_candidates: [],
    },
  };
}

function transaction(rootEventId, occurredAt, amount) {
  return {
    root_event_id: rootEventId,
    wish_id: WISH_ID,
    occurred_at: occurredAt,
    amount,
    type: "DEPOSIT",
  };
}

async function signRequest(request, dataRoot) {
  const script = [
    "import json, sys",
    "from recap_service.json_codec import digest",
    "value = json.load(sys.stdin)",
    "print(digest({key: item for key, item in value.items() if key not in {'generation_id', 'input_digest'}}))",
  ].join("; ");
  const result = await runWithInput("python3", ["-c", script], JSON.stringify(request), {
    cwd: dataRoot,
  });
  request.input_digest = result.stdout.trim();
}

async function insertPendingGenerations(postgres, requests) {
  const values = requests.map((request) => {
    return `(
      ${sql(request.generation_id)}, ${sql(ACCOUNT_ID)}, ${sql(STUDENT_ID)}, ${sql(ACADEMY_ID)},
      ${sql(request.kind)}, ${sql(request.period.start_date)}, ${sql(request.period.end_date_exclusive)},
      1, 'recap-1', 1, ${sql(request.input_digest)}, ${sql(JSON.stringify(request))},
      'PENDING', 0, NOW(), FALSE
    )`;
  });
  await psql(
    postgres,
    `INSERT INTO recap_generation (
      id, account_id, student_id, academy_id, kind, period_start, period_end_exclusive,
      schema_version, algorithm_version, generation_version, input_digest, request_json,
      state, attempt_count, created_at, current_version
    ) VALUES ${values.join(",")};`,
  );
}

async function waitForStoredRecaps(postgres, backend) {
  let latest = [];
  await waitUntil(
    async () => {
      latest = await readDatabaseEvidence(postgres);
      const terminalFailure = latest.find(
        (row) => row.state === "FAILED" || row.state === "NOT_ELIGIBLE",
      );
      if (terminalFailure !== undefined) {
        throw new Error(
          `Recap generation failed: ${JSON.stringify(latest)}\n${backend.output()}`,
        );
      }
      return latest.length === 2 && latest.every((row) => row.state === "SUCCEEDED");
    },
    45_000,
    "backend recap generation",
  );
  return latest;
}

async function readDatabaseEvidence(postgres) {
  const result = await psql(
    postgres,
    `SELECT kind, state, attempt_count, current_version, view_json IS NOT NULL
       FROM recap_generation
      WHERE id IN (${sql(WEEKLY_GENERATION_ID)}, ${sql(MONTHLY_GENERATION_ID)})
      ORDER BY kind`,
    ["--tuples-only", "--no-align", "--field-separator", "|"],
  );
  return result.stdout
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [kind, state, attempts, current, stored] = line.split("|");
      return {
        kind,
        state,
        attempts: Number(attempts),
        current: current === "t",
        stored: stored === "t",
      };
    });
}

async function psql(postgres, statement, extraArguments = []) {
  return runWithInput(
    "docker",
    [
      "exec",
      "--interactive",
      postgres.name,
      "psql",
      "--username",
      DATABASE_USER,
      "--dbname",
      DATABASE_NAME,
      "--set",
      "ON_ERROR_STOP=1",
      ...extraArguments,
    ],
    statement,
  );
}

function sql(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

async function selectPersona(page, baseUrl, persona) {
  const response = await page.request.post(`${baseUrl}/api/e2e/persona`, {
    data: { persona },
  });
  expect(response.status()).toBe(204);
}

function countSuccessfulPythonRequests(output) {
  return (output.match(/POST \/internal\/v1\/recap-generations HTTP\/1\.1" 200/g) ?? [])
    .length;
}

function cleanEnvironment() {
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
  return environment;
}

function spawnTracked(command, arguments_, options) {
  return spawn(command, arguments_, {
    ...options,
    detached: process.platform !== "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function captureOutput(child) {
  const chunks = [];
  const capture = (chunk) => {
    chunks.push(chunk.toString("utf8"));
    while (chunks.length > 200) chunks.shift();
  };
  child.stdout?.on("data", capture);
  child.stderr?.on("data", capture);
  return () => chunks.join("").slice(-40_000);
}

async function waitForJsonEvent(child, output, event, timeout) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error(`${event} process exited before readiness\n${output()}`);
    }
    for (const line of output().split("\n")) {
      try {
        const value = JSON.parse(line);
        if (value.event === event) return value;
      } catch {
        // Other process output is diagnostic rather than a readiness event.
      }
    }
    await delay(100);
  }
  throw new Error(`Timed out waiting for ${event}\n${output()}`);
}

async function waitForHttp(url, child, output, timeout) {
  await waitUntil(
    async () => {
      if (child.exitCode !== null || child.signalCode !== null) {
        throw new Error(`Process exited before ${url} became ready\n${output()}`);
      }
      try {
        const response = await fetch(url);
        return response.status < 500;
      } catch {
        return false;
      }
    },
    timeout,
    url,
  );
}

async function waitUntil(check, timeout, description) {
  const deadline = Date.now() + timeout;
  let lastError;
  while (Date.now() < deadline) {
    try {
      if (await check()) return;
    } catch (error) {
      lastError = error;
      break;
    }
    await delay(200);
  }
  if (lastError !== undefined) throw lastError;
  throw new Error(`Timed out waiting for ${description}`);
}

async function availablePort() {
  const reservation = createServer();
  await new Promise((resolvePromise, reject) => {
    reservation.once("error", reject);
    reservation.listen(0, "127.0.0.1", () => {
      reservation.off("error", reject);
      resolvePromise();
    });
  });
  const address = reservation.address();
  if (address === null || typeof address === "string") {
    throw new Error("Port reservation did not bind to TCP");
  }
  const { port } = address;
  await new Promise((resolvePromise, reject) =>
    reservation.close((error) =>
      error === undefined ? resolvePromise() : reject(error),
    ),
  );
  return port;
}

async function runCommand(command, arguments_, options = {}) {
  try {
    const result = await execFileAsync(command, arguments_, {
      cwd: options.cwd,
      env: options.env,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
      timeout: options.timeout ?? 30_000,
    });
    return { exitCode: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    if (options.allowFailure) {
      return {
        exitCode: typeof error.code === "number" ? error.code : 1,
        stdout: error.stdout ?? "",
        stderr: error.stderr ?? String(error),
      };
    }
    throw new Error(
      `${command} ${arguments_.join(" ")} failed\n${error.stderr ?? error.stdout ?? error}`,
      { cause: error },
    );
  }
}

function runWithInput(command, arguments_, input, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const timeout = options.timeout ?? 30_000;
    let settled = false;
    const child = spawn(command, arguments_, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const stdout = [];
    const stderr = [];
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error === null) resolvePromise(result);
      else reject(error);
    };
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      finish(new Error(`${command} timed out after ${timeout}ms`));
    }, timeout);
    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.once("error", (error) => finish(error));
    child.once("exit", (code) => {
      const result = {
        exitCode: code ?? 1,
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
      };
      if (code === 0) finish(null, result);
      else finish(new Error(`${command} failed\n${result.stderr || result.stdout}`));
    });
    child.stdin.end(input);
  });
}

async function closeResources(resources) {
  for (const resource of [...resources].reverse()) {
    try {
      await resource.close();
    } catch {
      // Preserve the primary test failure while making every cleanup best effort.
    }
  }
}

async function stopProcess(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const terminated = once(child, "exit");
  signalProcess(child, "SIGTERM");
  await Promise.race([terminated, delay(5_000)]);
  if (child.exitCode === null && child.signalCode === null) {
    const killed = once(child, "exit");
    signalProcess(child, "SIGKILL");
    await Promise.race([killed, delay(5_000)]);
  }
}

function signalProcess(child, signal) {
  try {
    if (process.platform === "win32") child.kill(signal);
    else process.kill(-child.pid, signal);
  } catch (error) {
    if (error?.code !== "ESRCH") throw error;
  }
}

function delay(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}
