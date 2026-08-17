const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DECIMAL_INTEGER_PATTERN = /^(0|[1-9][0-9]*)$/;
const MAX_DIAGNOSTIC_LENGTH = 512;

export class CardBalanceScenarioHttpError extends Error {
  constructor(status, responseBody) {
    super(`Balance scenario request failed with HTTP ${status}: ${responseBody}`);
    this.name = "CardBalanceScenarioHttpError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

export class CardBalanceScenarioProtocolError extends Error {
  constructor(status, responseBody) {
    super(`Balance scenario returned a malformed HTTP ${status} response: ${responseBody}`);
    this.name = "CardBalanceScenarioProtocolError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

export function normalizeCardBalanceAccountId(value) {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw new Error("Account ID must be a UUID.");
  }
  return value.toLowerCase();
}

export function normalizeApiBase(value) {
  if (
    typeof value !== "string"
    || value.length === 0
    || value.trim() !== value
    || /\s/.test(value)
    || value.includes("?")
    || value.includes("#")
  ) {
    throw invalidApiBaseError();
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw invalidApiBaseError();
  }

  if (
    (url.protocol !== "http:" && url.protocol !== "https:")
    || url.hostname.length === 0
    || url.username.length > 0
    || url.password.length > 0
    || url.search.length > 0
    || url.hash.length > 0
  ) {
    throw invalidApiBaseError();
  }

  url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
  return url;
}

export function buildBalanceScenarioUrl(apiBase, accountId) {
  const baseUrl = normalizeApiBase(apiBase);
  const normalizedAccountId = normalizeCardBalanceAccountId(accountId);
  return new URL(
    `e2e/card-balance-accounts/${encodeURIComponent(normalizedAccountId)}/balance-scenario`,
    baseUrl,
  );
}

export function parseRawStep(value) {
  if (value === "FAILURE") {
    return { type: "FAILURE" };
  }
  if (typeof value === "string" && value.startsWith("SUCCESS:")) {
    return {
      type: "SUCCESS",
      balance: parseBalance(value.slice("SUCCESS:".length), "SUCCESS balance"),
    };
  }
  throw new Error("Step must be FAILURE or SUCCESS:<balance>.");
}

export function buildPresetSteps(preset, options = {}) {
  switch (preset) {
    case "steady-success": {
      assertOnlyOptions(options, ["balance", "count"]);
      const balance = requireBalance(options.balance, "balance");
      const count = options.count === undefined
        ? 1
        : parsePositiveInteger(options.count, "count");
      return Array.from({ length: count }, () => ({ type: "SUCCESS", balance }));
    }
    case "increase": {
      assertOnlyOptions(options, ["fromBalance", "toBalance"]);
      const fromBalance = requireBalance(options.fromBalance, "from-balance");
      const toBalance = requireBalance(options.toBalance, "to-balance");
      if (fromBalance >= toBalance) {
        throw new Error("increase requires from-balance to be less than to-balance.");
      }
      return successPair(fromBalance, toBalance);
    }
    case "decrease": {
      assertOnlyOptions(options, ["fromBalance", "toBalance"]);
      const fromBalance = requireBalance(options.fromBalance, "from-balance");
      const toBalance = requireBalance(options.toBalance, "to-balance");
      if (toBalance >= fromBalance) {
        throw new Error("decrease requires to-balance to be less than from-balance.");
      }
      return successPair(fromBalance, toBalance);
    }
    case "failure":
      assertOnlyOptions(options, []);
      return [{ type: "FAILURE" }];
    case "failure-then-recovery": {
      assertOnlyOptions(options, ["balance"]);
      const balance = requireBalance(options.balance, "balance");
      return [{ type: "FAILURE" }, { type: "SUCCESS", balance }];
    }
    default:
      throw new Error(
        "Preset must be steady-success, increase, decrease, failure, or failure-then-recovery.",
      );
  }
}

export function createCardBalanceScenarioClient({
  apiBase,
  fetchImpl = globalThis.fetch,
}) {
  const normalizedApiBase = normalizeApiBase(apiBase);
  if (typeof fetchImpl !== "function") {
    throw new Error("A fetch implementation is required.");
  }

  async function replace(accountId, inputSteps) {
    const normalizedAccountId = normalizeCardBalanceAccountId(accountId);
    const steps = validateSteps(inputSteps, { allowEmpty: false });
    const response = await request(
      buildBalanceScenarioUrl(normalizedApiBase.href, normalizedAccountId),
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ steps }),
      },
    );
    return readScenarioEnvelope(response, normalizedAccountId, 200);
  }

  async function get(accountId) {
    const normalizedAccountId = normalizeCardBalanceAccountId(accountId);
    const response = await request(
      buildBalanceScenarioUrl(normalizedApiBase.href, normalizedAccountId),
      { method: "GET", headers: { Accept: "application/json" } },
    );
    return readScenarioEnvelope(response, normalizedAccountId, 200);
  }

  async function clear(accountId) {
    const normalizedAccountId = normalizeCardBalanceAccountId(accountId);
    const response = await request(
      buildBalanceScenarioUrl(normalizedApiBase.href, normalizedAccountId),
      { method: "DELETE" },
    );
    if (response.status !== 204) {
      throw new CardBalanceScenarioProtocolError(
        response.status,
        await responseDiagnostic(response),
      );
    }
  }

  async function request(url, init) {
    let response;
    try {
      response = await fetchImpl(url, { ...init, cache: "no-store" });
    } catch {
      throw new Error("Balance scenario request failed before receiving an HTTP response.");
    }
    if (!response.ok) {
      throw new CardBalanceScenarioHttpError(
        response.status,
        await responseDiagnostic(response),
      );
    }
    return response;
  }

  return Object.freeze({ replace, get, clear });
}

export async function withCardBalanceScenario(
  { client, accountId, steps },
  runScenario,
) {
  const normalizedAccountId = normalizeCardBalanceAccountId(accountId);
  try {
    await client.replace(normalizedAccountId, steps);
    return await runScenario({ client, accountId: normalizedAccountId });
  } finally {
    await client.clear(normalizedAccountId);
  }
}

async function readScenarioEnvelope(response, accountId, expectedStatus) {
  let responseBody;
  try {
    responseBody = await response.text();
  } catch {
    throw new CardBalanceScenarioProtocolError(
      response.status,
      "<unreadable response body>",
    );
  }
  const diagnostic = formatDiagnostic(responseBody);
  if (
    response.status !== expectedStatus
    || !hasJsonMediaType(response.headers.get("content-type"))
  ) {
    throw new CardBalanceScenarioProtocolError(response.status, diagnostic);
  }

  let value;
  try {
    value = JSON.parse(responseBody);
  } catch {
    throw new CardBalanceScenarioProtocolError(response.status, diagnostic);
  }

  try {
    assertExactObject(value, ["cardBalanceAccountId", "steps"]);
    if (value.cardBalanceAccountId !== accountId) {
      throw new Error("Response account does not match the request.");
    }
    return {
      cardBalanceAccountId: accountId,
      steps: validateSteps(value.steps, {
        allowEmpty: true,
        parseStepBalance: parseJsonBalance,
      }),
    };
  } catch {
    throw new CardBalanceScenarioProtocolError(response.status, diagnostic);
  }
}

function validateSteps(value, { allowEmpty, parseStepBalance = parseBalance }) {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) {
    throw new Error("Balance scenario steps must be a nonempty array.");
  }
  return value.map((step) => validateStep(step, parseStepBalance));
}

function validateStep(value, parseStepBalance) {
  if (value?.type === "SUCCESS") {
    assertExactObject(value, ["type", "balance"]);
    return { type: "SUCCESS", balance: parseStepBalance(value.balance, "SUCCESS balance") };
  }
  if (value?.type === "FAILURE") {
    assertExactObject(value, ["type"]);
    return { type: "FAILURE" };
  }
  throw new Error("Balance scenario step type must be SUCCESS or FAILURE.");
}

function assertExactObject(value, expectedKeys) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Expected a JSON object.");
  }
  const keys = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  if (keys.length !== expected.length || keys.some((key, index) => key !== expected[index])) {
    throw new Error("JSON object members do not match the contract.");
  }
}

function parseBalance(value, label) {
  const number = typeof value === "number"
    ? value
    : typeof value === "string" && DECIMAL_INTEGER_PATTERN.test(value)
      ? Number(value)
      : Number.NaN;
  if (!Number.isSafeInteger(number) || number < 0) {
    throw new Error(`${label} must be an integer from 0 through ${Number.MAX_SAFE_INTEGER}.`);
  }
  return number;
}

function parseJsonBalance(value, label) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} must be a JSON integer from 0 through ${Number.MAX_SAFE_INTEGER}.`);
  }
  return value;
}

function hasJsonMediaType(value) {
  if (typeof value !== "string") return false;
  const [mediaType] = value.split(";", 1);
  return mediaType.trim().toLowerCase() === "application/json";
}

function requireBalance(value, label) {
  if (value === undefined) {
    throw new Error(`${label} is required for this preset.`);
  }
  return parseBalance(value, label);
}

function parsePositiveInteger(value, label) {
  const number = typeof value === "number"
    ? value
    : typeof value === "string" && DECIMAL_INTEGER_PATTERN.test(value)
      ? Number(value)
      : Number.NaN;
  if (!Number.isSafeInteger(number) || number <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
  return number;
}

function assertOnlyOptions(options, allowedKeys) {
  const unexpected = Object.entries(options)
    .filter(([, value]) => value !== undefined)
    .map(([key]) => key)
    .filter((key) => !allowedKeys.includes(key));
  if (unexpected.length > 0) {
    throw new Error(`Preset does not accept ${unexpected.join(", ")}.`);
  }
}

function successPair(fromBalance, toBalance) {
  return [
    { type: "SUCCESS", balance: fromBalance },
    { type: "SUCCESS", balance: toBalance },
  ];
}

async function responseDiagnostic(response) {
  let text;
  try {
    text = await response.text();
  } catch {
    return "<unreadable response body>";
  }
  return formatDiagnostic(text);
}

function formatDiagnostic(text) {
  const normalized = [...text]
    .map((character) => {
      const codePoint = character.codePointAt(0);
      return codePoint <= 31 || codePoint === 127 ? " " : character;
    })
    .join("")
    .trim();
  if (normalized.length === 0) return "<empty response body>";
  return normalized.length <= MAX_DIAGNOSTIC_LENGTH
    ? normalized
    : `${normalized.slice(0, MAX_DIAGNOSTIC_LENGTH)}...`;
}

function invalidApiBaseError() {
  return new Error(
    "API base must be an absolute HTTP(S) URL without credentials, query, fragment, or whitespace.",
  );
}
