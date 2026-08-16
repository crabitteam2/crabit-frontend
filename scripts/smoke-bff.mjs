import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer, request as httpRequest } from "node:http";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const upstreamRequests = [];

const upstream = createServer(async (request, response) => {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const body = Buffer.concat(chunks);
  upstreamRequests.push({ method: request.method, url: request.url });
  const pathname = new URL(request.url ?? "/", "http://upstream.test").pathname;

  if (pathname === "/v1/redirect") {
    response.writeHead(302, {
      "Cache-Control": "public, max-age=600",
      "Content-Type": "text/plain",
      Location: "https://other.example/secret",
      "Set-Cookie": "session=upstream; HttpOnly",
    });
    response.end("redirect-body");
    return;
  }

  if (pathname === "/v1/binary") {
    response.writeHead(200, { "Content-Type": "application/octet-stream" });
    response.end(body);
    return;
  }

  response.writeHead(200, {
    "Content-Type": "application/json",
    "Idempotency-Replayed": "true",
    "Set-Cookie": "session=upstream; HttpOnly",
    "X-Upstream-Secret": "must-not-pass",
  });
  response.end(JSON.stringify({
    method: request.method,
    url: request.url,
    authorization: request.headers.authorization ?? null,
    cookie: request.headers.cookie ?? null,
    idempotencyKey: request.headers["idempotency-key"] ?? null,
    ifMatch: request.headers["if-match"] ?? null,
  }));
});

let nextProcess;

try {
  const upstreamPort = await listenOnAvailablePort(upstream);
  const appPort = await reservePort();
  const backendUrl = `http://127.0.0.1:${upstreamPort}`;
  const nextBin = fileURLToPath(
    new URL("node_modules/next/dist/bin/next", new URL(`file://${projectRoot}/`)),
  );

  nextProcess = spawn(
    process.execPath,
    [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(appPort)],
    {
      cwd: projectRoot,
      env: {
        ...process.env,
        APP_ENV: "local",
        BACKEND_URL: backendUrl,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let serverOutput = "";
  let startError;
  nextProcess.stdout.on("data", (chunk) => {
    serverOutput = `${serverOutput}${chunk}`.slice(-8_000);
  });
  nextProcess.stderr.on("data", (chunk) => {
    serverOutput = `${serverOutput}${chunk}`.slice(-8_000);
  });
  nextProcess.once("error", (error) => {
    startError = error;
  });

  const appOrigin = `http://127.0.0.1:${appPort}`;
  await waitForServer(`${appOrigin}/`, () => ({
    processExitCode: nextProcess.exitCode,
    serverOutput,
    startError,
  }));

  const query = "?state=OPEN&state=CLOSED&cursor=a%2Fb&empty=";
  const forwarded = await rawRequest(appOrigin, `/api/backend/v1/echo${query}`, {
    headers: {
      Authorization: "Bearer browser-secret",
      Cookie: "session=browser-secret",
      "Idempotency-Key": "idem-smoke",
      "If-Match": "7",
    },
  });
  assert.equal(forwarded.status, 200);
  assert.equal(forwarded.headers["cache-control"], "no-store");
  assert.equal(forwarded.headers["idempotency-replayed"], "true");
  assert.equal(forwarded.headers["set-cookie"], undefined);
  assert.equal(forwarded.headers["x-upstream-secret"], undefined);
  assert.deepEqual(JSON.parse(forwarded.body.toString("utf8")), {
    method: "GET",
    url: `/v1/echo${query}`,
    authorization: null,
    cookie: null,
    idempotencyKey: "idem-smoke",
    ifMatch: "7",
  });

  const binaryBody = Buffer.from([0, 255, 1, 254]);
  const binary = await fetch(`${appOrigin}/api/backend/v1/binary`, {
    method: "PATCH",
    headers: { "Content-Type": "application/octet-stream" },
    body: binaryBody,
  });
  assert.equal(binary.status, 200);
  assert.deepEqual(
    Array.from(new Uint8Array(await binary.arrayBuffer())),
    Array.from(binaryBody),
  );

  const beforeRedirect = upstreamRequests.length;
  const redirect = await fetch(`${appOrigin}/api/backend/v1/redirect`, {
    redirect: "manual",
  });
  assert.equal(upstreamRequests.length, beforeRedirect + 1);
  assert.equal(redirect.status, 302);
  assert.equal(await redirect.text(), "redirect-body");
  assert.equal(redirect.headers.get("location"), null);
  assert.equal(redirect.headers.get("set-cookie"), null);
  assert.equal(redirect.headers.get("cache-control"), "no-store");

  const beforeRejection = upstreamRequests.length;
  const rejected = await fetch(`${appOrigin}/api/backend/v1/echo`, {
    method: "OPTIONS",
  });
  assert.equal(rejected.status, 405);
  assert.equal(rejected.headers.get("allow"), "GET, POST, PUT, PATCH, DELETE");
  assert.equal(upstreamRequests.length, beforeRejection);

  const invalidTarget = await fetch(
    `${appOrigin}/api/backend/nested%2Fsegment`,
  );
  assert.equal(invalidTarget.status, 400);
  assert.deepEqual(await invalidTarget.json(), {
    code: "BFF_INVALID_REQUEST",
    message: "BFF request is invalid",
  });
  assert.equal(upstreamRequests.length, beforeRejection);

  console.log("BFF production smoke passed");
} finally {
  await stopChild(nextProcess);
  upstream.closeAllConnections();
  if (upstream.listening) {
    await new Promise((resolve, reject) => {
      upstream.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

async function listenOnAvailablePort(server) {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("Mock upstream did not bind a TCP port");
  }
  return address.port;
}

async function reservePort() {
  const server = createServer();
  const port = await listenOnAvailablePort(server);
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  return port;
}

async function rawRequest(origin, path, options = {}) {
  const target = new URL(origin);
  return await new Promise((resolve, reject) => {
    const request = httpRequest({
      hostname: target.hostname,
      port: target.port,
      path,
      method: options.method ?? "GET",
      headers: options.headers,
    }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      response.once("error", reject);
      response.once("end", () => {
        resolve({
          status: response.statusCode,
          headers: response.headers,
          body: Buffer.concat(chunks),
        });
      });
    });
    request.once("error", reject);
    request.end(options.body);
  });
}

async function waitForServer(url, status) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    const current = status();
    if (current.startError) {
      throw current.startError;
    }
    if (current.processExitCode !== null) {
      throw new Error(
        `Next.js exited before becoming ready (${current.processExitCode})\n${current.serverOutput}`,
      );
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // The production server is still starting.
    }
    await delay(100);
  }

  const current = status();
  throw new Error(`Next.js did not become ready\n${current.serverOutput}`);
}

async function stopChild(child) {
  if (child === undefined || child.exitCode !== null) {
    return;
  }

  const exited = once(child, "exit");
  child.kill("SIGTERM");
  const result = await Promise.race([exited.then(() => true), delay(5_000).then(() => false)]);
  if (!result && child.exitCode === null) {
    child.kill("SIGKILL");
    await once(child, "exit");
  }
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
