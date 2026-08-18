import {
  buildPresetSteps,
  createCardBalanceScenarioClient,
  normalizeCardBalanceAccountId,
  parseRawStep,
} from "./card-balance-scenario.mjs";

const VALUE_FLAGS = new Set([
  "api-base",
  "account-id",
  "step",
  "preset",
  "balance",
  "count",
  "from-balance",
  "to-balance",
]);

export const BALANCE_CLI_HELP = `Usage:
  npm run e2e:balance -- put [options]
  npm run e2e:balance -- get [options]
  npm run e2e:balance -- delete [options]

Shared options:
  --api-base <url>       API base; overrides E2E_API_BASE_URL
  --account-id <uuid>    Explicit account; overrides E2E_CARD_BALANCE_ACCOUNT_ID

PUT input (choose one):
  --step SUCCESS:<amount>  Repeat to preserve raw step order
  --step FAILURE
  --preset steady-success --balance <amount> [--count <positive integer>]
  --preset increase --from-balance <amount> --to-balance <amount>
  --preset decrease --from-balance <amount> --to-balance <amount>
  --preset failure
  --preset failure-then-recovery --balance <amount>

Examples:
  npm run e2e:balance -- put --api-base http://127.0.0.1:18080 --account-id <uuid> --preset steady-success --balance 100000
  npm run e2e:balance -- get --api-base http://127.0.0.1:3000/api/backend --account-id <uuid>
  npm run e2e:balance -- delete --api-base http://127.0.0.1:18080 --account-id <uuid>`;

export function parseBalanceCliArguments(args, env = process.env) {
  const command = args[0];
  if (!new Set(["put", "get", "delete"]).has(command)) {
    throw new Error("Command must be put, get, or delete. Use --help for usage.");
  }

  const flags = parseFlags(args.slice(1));
  const apiBase = flags.get("api-base")?.at(-1) ?? env.E2E_API_BASE_URL;
  const accountId = flags.get("account-id")?.at(-1)
    ?? env.E2E_CARD_BALANCE_ACCOUNT_ID;
  if (apiBase === undefined || apiBase.length === 0) {
    throw new Error("API base is required through --api-base or E2E_API_BASE_URL.");
  }
  if (accountId === undefined || accountId.length === 0) {
    throw new Error(
      "Account ID is required through --account-id or E2E_CARD_BALANCE_ACCOUNT_ID.",
    );
  }
  normalizeCardBalanceAccountId(accountId);

  const putOnlyFlags = [
    "step", "preset", "balance", "count", "from-balance", "to-balance",
  ];
  if (command !== "put" && putOnlyFlags.some((name) => flags.has(name))) {
    throw new Error(`${command} does not accept PUT scenario options.`);
  }
  if (command !== "put") {
    return { command, apiBase, accountId };
  }

  const rawSteps = flags.get("step") ?? [];
  const preset = flags.get("preset")?.at(-1);
  if (rawSteps.length > 0 && preset !== undefined) {
    throw new Error("--preset cannot be combined with --step.");
  }
  if (rawSteps.length === 0 && preset === undefined) {
    throw new Error("PUT requires either --preset or at least one --step.");
  }

  let steps;
  if (rawSteps.length > 0) {
    if (["balance", "count", "from-balance", "to-balance"].some(
      (name) => flags.has(name),
    )) {
      throw new Error("Raw --step input does not accept preset amount options.");
    }
    steps = rawSteps.map(parseRawStep);
  } else {
    steps = buildPresetSteps(preset, {
      balance: flagNumber(flags, "balance"),
      count: flagNumber(flags, "count"),
      fromBalance: flagNumber(flags, "from-balance"),
      toBalance: flagNumber(flags, "to-balance"),
    });
  }

  return { command, apiBase, accountId, steps };
}

export async function runBalanceCli(args, {
  env = process.env,
  fetchImpl = globalThis.fetch,
  stdout = console.log,
  stderr = console.error,
} = {}) {
  if (args.length === 1 && (args[0] === "--help" || args[0] === "-h")) {
    stdout(BALANCE_CLI_HELP);
    return 0;
  }

  try {
    const options = parseBalanceCliArguments(args, env);
    const client = createCardBalanceScenarioClient({
      apiBase: options.apiBase,
      fetchImpl,
    });
    if (options.command === "put") {
      stdout(JSON.stringify(
        await client.replace(options.accountId, options.steps),
        null,
        2,
      ));
    } else if (options.command === "get") {
      stdout(JSON.stringify(await client.get(options.accountId), null, 2));
    } else {
      await client.clear(options.accountId);
      stdout(JSON.stringify({
        cardBalanceAccountId: normalizeCardBalanceAccountId(options.accountId),
        cleared: true,
      }, null, 2));
    }
    return 0;
  } catch (error) {
    stderr(`Error: ${error instanceof Error ? error.message : "Unknown CLI failure."}`);
    return 1;
  }
}

function parseFlags(args) {
  const flags = new Map();
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (!argument.startsWith("--")) {
      throw new Error(`Unexpected argument ${argument}.`);
    }
    const name = argument.slice(2);
    if (!VALUE_FLAGS.has(name)) {
      throw new Error(`Unknown option --${name}.`);
    }
    const value = args[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`--${name} requires a value.`);
    }
    if (name !== "step" && flags.has(name)) {
      throw new Error(`--${name} may be specified only once.`);
    }
    flags.set(name, [...(flags.get(name) ?? []), value]);
    index += 1;
  }
  return flags;
}

function flagNumber(flags, name) {
  const value = flags.get(name)?.at(-1);
  if (value === undefined) return undefined;
  if (!/^(0|[1-9][0-9]*)$/.test(value)) {
    throw new Error(`--${name} must be a nonnegative integer.`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`--${name} must be a safe integer.`);
  }
  return parsed;
}
