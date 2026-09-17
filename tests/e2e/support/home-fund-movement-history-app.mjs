import { account, accountId, events, oldEvent } from "./home-fund-movement-history/fixtures.mjs";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";

export async function startHistoryApp(port = 3197) {
  const requests = [];
  const upstream = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    let body;
    if (url.pathname.endsWith("/me/card-balance-accounts")) body = { items: [account] };
    else if (url.pathname.endsWith("/fund-movements")) {
      requests.push(Object.fromEntries(url.searchParams));
      const q = url.searchParams.get("q") ?? "";
      if (!url.pathname.includes(accountId)) { res.writeHead(404, { "Content-Type": "application/json" }).end(JSON.stringify({ error: { code: "CARD_BALANCE_ACCOUNT_NOT_FOUND", message: "Account not found", retryable: false, traceId: "test", fieldErrors: [], details: {} } })); return; }
      if (q === "느린 검색") await new Promise(resolve => setTimeout(resolve, 1200));
      if (q === "오류") { res.writeHead(503, { "Content-Type": "application/json" }).end(JSON.stringify({ error: { code: "UPSTREAM_UNAVAILABLE", message: "Unavailable", retryable: true, traceId: "test", fieldErrors: [], details: {} } })); return; }
      if (q) body = { items: q.includes("피아노") || q === "999999999" ? [oldEvent] : q === "여름" ? [events[1]] : [], nextCursor: null };
      else if (url.searchParams.has("cursor")) body = { items: [events[6], oldEvent], nextCursor: null };
      else body = { items: url.searchParams.get("sort") === "asc" ? [...events].reverse() : events, nextCursor: "page-two" };
    } else { res.writeHead(404).end(); return; }
    res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(body));
  });
  upstream.listen(0, "127.0.0.1");
  await once(upstream, "listening");

  const child = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      ...(process.env.HISTORY_E2E_PRODUCTION === "1" ? ["start"] : ["dev", "--webpack"]),
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
          if (response.status < 500) return { url, close, requests };
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
