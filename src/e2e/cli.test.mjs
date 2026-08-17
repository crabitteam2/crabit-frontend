import { describe, expect, it, vi } from "vitest";

import { parseBalanceCliArguments, runBalanceCli } from "./cli.mjs";

const FLAG_ACCOUNT_ID = "11111111-1111-4111-8111-111111111111";
const ENV_ACCOUNT_ID = "22222222-2222-4222-8222-222222222222";

describe("balance scenario CLI", () => {
  it("gives flags precedence over environment and preserves repeated raw steps", () => {
    expect(parseBalanceCliArguments([
      "put",
      "--api-base", "http://flag.example/api/backend",
      "--account-id", FLAG_ACCOUNT_ID,
      "--step", "SUCCESS:100",
      "--step", "FAILURE",
      "--step", "SUCCESS:125",
    ], {
      E2E_API_BASE_URL: "http://env.example",
      E2E_CARD_BALANCE_ACCOUNT_ID: ENV_ACCOUNT_ID,
    })).toEqual({
      command: "put",
      apiBase: "http://flag.example/api/backend",
      accountId: FLAG_ACCOUNT_ID,
      steps: [
        { type: "SUCCESS", balance: 100 },
        { type: "FAILURE" },
        { type: "SUCCESS", balance: 125 },
      ],
    });
  });

  it("reads API base and account ID from the environment when flags are absent", () => {
    expect(parseBalanceCliArguments(["get"], {
      E2E_API_BASE_URL: "http://env.example/api/backend",
      E2E_CARD_BALANCE_ACCOUNT_ID: ENV_ACCOUNT_ID,
    })).toEqual({
      command: "get",
      apiBase: "http://env.example/api/backend",
      accountId: ENV_ACCOUNT_ID,
    });
  });

  it("builds parameterized presets from CLI values", () => {
    expect(parseBalanceCliArguments([
      "put",
      "--api-base", "http://backend.example",
      "--account-id", FLAG_ACCOUNT_ID,
      "--preset", "failure-then-recovery",
      "--balance", "5000",
    ], {})).toMatchObject({
      steps: [{ type: "FAILURE" }, { type: "SUCCESS", balance: 5000 }],
    });
  });

  it.each([
    [[], "Command must be put, get, or delete"],
    [["get"], "API base is required"],
    [["delete", "--api-base", "http://backend.example"], "Account ID is required"],
    [[
      "put", "--api-base", "http://backend.example", "--account-id", FLAG_ACCOUNT_ID,
    ], "PUT requires either --preset or at least one --step"],
    [[
      "put", "--api-base", "http://backend.example", "--account-id", FLAG_ACCOUNT_ID,
      "--preset", "failure", "--step", "FAILURE",
    ], "--preset cannot be combined with --step"],
  ])("fails before HTTP for invalid arguments", (args, message) => {
    expect(() => parseBalanceCliArguments(args, {})).toThrow(message);
  });

  it("prints help without requiring environment configuration", async () => {
    const stdout = vi.fn();
    const fetchImpl = vi.fn();

    await expect(runBalanceCli(["--help"], {
      env: {},
      fetchImpl,
      stdout,
      stderr: vi.fn(),
    })).resolves.toBe(0);
    expect(stdout).toHaveBeenCalledWith(expect.stringContaining("steady-success"));
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("returns nonzero and surfaces safe HTTP diagnostics", async () => {
    const stderr = vi.fn();

    await expect(runBalanceCli(["get"], {
      env: {
        E2E_API_BASE_URL: "http://backend.example",
        E2E_CARD_BALANCE_ACCOUNT_ID: FLAG_ACCOUNT_ID,
      },
      fetchImpl: vi.fn(async () => new Response(
        JSON.stringify({ error: { code: "NOT_READY" } }),
        { status: 503 },
      )),
      stdout: vi.fn(),
      stderr,
    })).resolves.toBe(1);
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining("HTTP 503"));
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining("NOT_READY"));
  });
});
