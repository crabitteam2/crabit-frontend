import { createServer } from "node:http";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CardBalanceScenarioHttpError,
  CardBalanceScenarioProtocolError,
  buildBalanceScenarioUrl,
  buildPresetSteps,
  createCardBalanceScenarioClient,
  parseRawStep,
  withCardBalanceScenario,
} from "./card-balance-scenario.mjs";

const ACCOUNT_ID = "11111111-1111-4111-8111-111111111111";
const ALPHA_ACCOUNT_ID = "abcdefab-cdef-4abc-8def-abcdefabcdef";
const OTHER_ACCOUNT_ID = "22222222-2222-4222-8222-222222222222";
const servers = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map(
    (server) => new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    }),
  ));
});

describe("card-balance scenario URLs", () => {
  it.each([
    [
      "http://127.0.0.1:18080",
      `http://127.0.0.1:18080/e2e/card-balance-accounts/${ACCOUNT_ID}/balance-scenario`,
    ],
    [
      "http://127.0.0.1:3000/api/backend/",
      `http://127.0.0.1:3000/api/backend/e2e/card-balance-accounts/${ACCOUNT_ID}/balance-scenario`,
    ],
  ])("preserves the API base path and joins one separator", (base, expected) => {
    expect(buildBalanceScenarioUrl(base, ACCOUNT_ID).href).toBe(expected);
  });

  it.each([
    "relative/api",
    "ftp://backend.example",
    "http://user:password@backend.example",
    "http://backend.example/api?",
    "http://backend.example/api?mode=e2e",
    "http://backend.example/api#",
    "http://backend.example/api#fragment",
    " http://backend.example",
  ])("rejects an unsafe API base before HTTP: %s", (base) => {
    expect(() => buildBalanceScenarioUrl(base, ACCOUNT_ID)).toThrow(
      "API base must be an absolute HTTP(S) URL",
    );
  });

  it("rejects a missing or invalid account ID before HTTP", () => {
    expect(() => buildBalanceScenarioUrl("http://backend.example", "shared-owner"))
      .toThrow("Account ID must be a UUID");
  });
});

describe("card-balance scenario steps", () => {
  it("preserves repeated raw SUCCESS and FAILURE step order", () => {
    expect([
      parseRawStep("SUCCESS:100000"),
      parseRawStep("FAILURE"),
      parseRawStep("SUCCESS:125000"),
    ]).toEqual([
      { type: "SUCCESS", balance: 100000 },
      { type: "FAILURE" },
      { type: "SUCCESS", balance: 125000 },
    ]);
  });

  it.each([
    ["steady-success", { balance: 5000 }, [{ type: "SUCCESS", balance: 5000 }]],
    [
      "steady-success",
      { balance: 5000, count: 2 },
      [{ type: "SUCCESS", balance: 5000 }, { type: "SUCCESS", balance: 5000 }],
    ],
    [
      "increase",
      { fromBalance: 5000, toBalance: 7000 },
      [{ type: "SUCCESS", balance: 5000 }, { type: "SUCCESS", balance: 7000 }],
    ],
    [
      "decrease",
      { fromBalance: 7000, toBalance: 5000 },
      [{ type: "SUCCESS", balance: 7000 }, { type: "SUCCESS", balance: 5000 }],
    ],
    ["failure", {}, [{ type: "FAILURE" }]],
    [
      "failure-then-recovery",
      { balance: 5000 },
      [{ type: "FAILURE" }, { type: "SUCCESS", balance: 5000 }],
    ],
  ])("expands the %s preset deterministically", (preset, options, expected) => {
    expect(buildPresetSteps(preset, options)).toEqual(expected);
  });

  it.each([
    ["SUCCESS:-1"],
    ["SUCCESS:1.5"],
    [`SUCCESS:${Number.MAX_SAFE_INTEGER + 1}`],
    ["FAILURE:100"],
    ["UNKNOWN"],
  ])("rejects an invalid raw step: %s", (step) => {
    expect(() => parseRawStep(step)).toThrow();
  });

  it.each([
    ["increase", { fromBalance: 100, toBalance: 100 }],
    ["increase", { fromBalance: 200, toBalance: 100 }],
    ["decrease", { fromBalance: 100, toBalance: 100 }],
    ["decrease", { fromBalance: 100, toBalance: 200 }],
    ["failure", { balance: 100 }],
    ["unknown", {}],
  ])("rejects invalid %s preset input", (preset, options) => {
    expect(() => buildPresetSteps(preset, options)).toThrow();
  });
});

describe("card-balance scenario client", () => {
  it("uses the real account-local PUT, repeated GET, and idempotent DELETE contract", async () => {
    const state = new Map();
    const requests = [];
    const apiBase = await startControlledServer(async (request, response) => {
      const accountId = accountIdFrom(request.url);
      requests.push({ method: request.method, accountId });

      if (request.method === "PUT") {
        const body = await readJson(request);
        state.set(accountId, structuredClone(body.steps));
        writeJson(response, 200, { cardBalanceAccountId: accountId, steps: body.steps });
        return;
      }
      if (request.method === "GET") {
        writeJson(response, 200, {
          cardBalanceAccountId: accountId,
          steps: structuredClone(state.get(accountId) ?? []),
        });
        return;
      }
      if (request.method === "DELETE") {
        state.delete(accountId);
        response.writeHead(204).end();
      }
    });
    const client = createCardBalanceScenarioClient({ apiBase });
    const steps = [
      { type: "SUCCESS", balance: 100000 },
      { type: "FAILURE" },
    ];

    await expect(client.replace(ACCOUNT_ID, steps)).resolves.toEqual({
      cardBalanceAccountId: ACCOUNT_ID,
      steps,
    });
    await expect(client.get(ACCOUNT_ID)).resolves.toEqual({
      cardBalanceAccountId: ACCOUNT_ID,
      steps,
    });
    await expect(client.get(ACCOUNT_ID)).resolves.toEqual({
      cardBalanceAccountId: ACCOUNT_ID,
      steps,
    });
    await expect(client.clear(ACCOUNT_ID)).resolves.toBeUndefined();
    await expect(client.clear(ACCOUNT_ID)).resolves.toBeUndefined();
    await expect(client.get(ACCOUNT_ID)).resolves.toEqual({
      cardBalanceAccountId: ACCOUNT_ID,
      steps: [],
    });
    expect(requests.map(({ method }) => method)).toEqual([
      "PUT", "GET", "GET", "DELETE", "DELETE", "GET",
    ]);
  });

  it("reports non-2xx responses with bounded body diagnostics", async () => {
    const apiBase = await startControlledServer((_request, response) => {
      response.writeHead(422, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: { code: "INVALID_BALANCE_SCENARIO" } }));
    });
    const client = createCardBalanceScenarioClient({ apiBase });

    await expect(client.get(ACCOUNT_ID)).rejects.toMatchObject({
      name: CardBalanceScenarioHttpError.name,
      status: 422,
      responseBody: '{"error":{"code":"INVALID_BALANCE_SCENARIO"}}',
    });
  });

  it("rejects a malformed success envelope instead of treating it as configured state", async () => {
    const apiBase = await startControlledServer((_request, response) => {
      writeJson(response, 200, { cardBalanceAccountId: ACCOUNT_ID, steps: "not-an-array" });
    });
    const client = createCardBalanceScenarioClient({ apiBase });

    await expect(client.get(ACCOUNT_ID)).rejects.toMatchObject({
      name: CardBalanceScenarioProtocolError.name,
      status: 200,
    });
  });

  it("rejects a numeric string in a SUCCESS response instead of coercing it", async () => {
    const apiBase = await startControlledServer((_request, response) => {
      writeJson(response, 200, {
        cardBalanceAccountId: ACCOUNT_ID,
        steps: [{ type: "SUCCESS", balance: "100000" }],
      });
    });
    const client = createCardBalanceScenarioClient({ apiBase });

    await expect(client.get(ACCOUNT_ID)).rejects.toMatchObject({
      name: CardBalanceScenarioProtocolError.name,
      status: 200,
    });
  });

  it("rejects a noncanonical uppercase account ID in a success response", async () => {
    const apiBase = await startControlledServer((_request, response) => {
      writeJson(response, 200, {
        cardBalanceAccountId: ALPHA_ACCOUNT_ID.toUpperCase(),
        steps: [],
      });
    });
    const client = createCardBalanceScenarioClient({ apiBase });

    await expect(client.get(ALPHA_ACCOUNT_ID)).rejects.toMatchObject({
      name: CardBalanceScenarioProtocolError.name,
      status: 200,
    });
  });

  it("rejects an application/json lookalike media type", async () => {
    const apiBase = await startControlledServer((_request, response) => {
      writeJson(
        response,
        200,
        { cardBalanceAccountId: ACCOUNT_ID, steps: [] },
        "application/jsonp",
      );
    });
    const client = createCardBalanceScenarioClient({ apiBase });

    await expect(client.get(ACCOUNT_ID)).rejects.toMatchObject({
      name: CardBalanceScenarioProtocolError.name,
      status: 200,
    });
  });

  it.each([
    "application/json; charset=utf-8",
    'Application/JSON; charset="utf-8"; profile="https://example.test/a;b\\\"c"',
  ])("accepts application/json with valid media type parameters: %s", async (contentType) => {
    const apiBase = await startControlledServer((_request, response) => {
      writeJson(
        response,
        200,
        { cardBalanceAccountId: ACCOUNT_ID, steps: [] },
        contentType,
      );
    });
    const client = createCardBalanceScenarioClient({ apiBase });

    await expect(client.get(ACCOUNT_ID)).resolves.toEqual({
      cardBalanceAccountId: ACCOUNT_ID,
      steps: [],
    });
  });

  it.each([
    ["missing equals sign", "application/json; charset"],
    ["empty parameter name", "application/json; =utf-8"],
    ["unterminated quoted value", 'application/json; charset="unterminated'],
  ])("rejects Content-Type with a %s", async (_case, contentType) => {
    const apiBase = await startControlledServer((_request, response) => {
      writeJson(
        response,
        200,
        { cardBalanceAccountId: ACCOUNT_ID, steps: [] },
        contentType,
      );
    });
    const client = createCardBalanceScenarioClient({ apiBase });

    await expect(client.get(ACCOUNT_ID)).rejects.toMatchObject({
      name: CardBalanceScenarioProtocolError.name,
      status: 200,
    });
  });

  it("validates the full success body without truncating a long scenario", async () => {
    const steps = buildPresetSteps("steady-success", { balance: 100_000, count: 40 });
    const apiBase = await startControlledServer((_request, response) => {
      writeJson(response, 200, { cardBalanceAccountId: ACCOUNT_ID, steps });
    });
    const client = createCardBalanceScenarioClient({ apiBase });

    await expect(client.get(ACCOUNT_ID)).resolves.toEqual({
      cardBalanceAccountId: ACCOUNT_ID,
      steps,
    });
  });

  it("always attempts account-local cleanup after setup starts and the body fails", async () => {
    const calls = [];
    const client = {
      replace: vi.fn(async (accountId, steps) => calls.push(["replace", accountId, steps])),
      clear: vi.fn(async (accountId) => calls.push(["clear", accountId])),
    };
    const failure = new Error("test body failed");

    await expect(withCardBalanceScenario({
      client,
      accountId: OTHER_ACCOUNT_ID,
      steps: [{ type: "FAILURE" }],
    }, async () => {
      throw failure;
    })).rejects.toBe(failure);
    expect(calls).toEqual([
      ["replace", OTHER_ACCOUNT_ID, [{ type: "FAILURE" }]],
      ["clear", OTHER_ACCOUNT_ID],
    ]);
  });
});

async function startControlledServer(handler) {
  const server = createServer((request, response) => {
    Promise.resolve(handler(request, response)).catch((error) => {
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.end(String(error));
    });
  });
  servers.push(server);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  return `http://127.0.0.1:${address.port}/api/backend`;
}

function accountIdFrom(rawUrl) {
  return new URL(rawUrl, "http://test.local").pathname.split("/").at(-2);
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function writeJson(response, status, body, contentType = "application/json") {
  response.writeHead(status, { "Content-Type": contentType });
  response.end(JSON.stringify(body));
}
