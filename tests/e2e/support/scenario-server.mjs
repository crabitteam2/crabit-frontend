import { createServer } from "node:http";

const port = 19_181;
const scenarios = new Map();
const scenarioPath = /^\/(?:api\/backend\/)?e2e\/card-balance-accounts\/([0-9a-f-]+)\/balance-scenario$/;

const server = createServer((request, response) => {
  handleRequest(request, response).catch(() => {
    writeJson(response, 500, { error: { code: "CONTROLLED_SERVER_FAILURE" } });
  });
});

server.listen(port, "127.0.0.1");

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}

async function handleRequest(request, response) {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  if (request.method === "GET" && url.pathname === "/health") {
    response.writeHead(204).end();
    return;
  }

  const match = scenarioPath.exec(url.pathname);
  if (match === null) {
    writeJson(response, 404, { error: { code: "NOT_FOUND" } });
    return;
  }
  const accountId = match[1].toLowerCase();

  if (request.method === "PUT") {
    const body = await readJson(request);
    scenarios.set(accountId, structuredClone(body.steps));
    writeJson(response, 200, {
      cardBalanceAccountId: accountId,
      steps: body.steps,
    });
    return;
  }
  if (request.method === "GET") {
    writeJson(response, 200, {
      cardBalanceAccountId: accountId,
      steps: structuredClone(scenarios.get(accountId) ?? []),
    });
    return;
  }
  if (request.method === "DELETE") {
    scenarios.delete(accountId);
    response.writeHead(204).end();
    return;
  }
  response.writeHead(405, { Allow: "GET, PUT, DELETE" }).end();
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function writeJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}
