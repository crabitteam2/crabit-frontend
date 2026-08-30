import createClient from "openapi-fetch";
import { describe, expect, it } from "vitest";

import {
  getCardBalanceAccount,
  listMyCardBalanceAccounts,
} from "./card-balance-accounts";
import type { paths } from "./generated/crabit-backend";

const accountId = "11111111-1111-4111-8111-111111111111";

describe("Card Balance Account typed request helper", () => {
  it.each([
    {
      cardBalanceAccountId: accountId,
      academyId: "22222222-2222-4222-8222-222222222222",
      balanceKnowledge: "UNKNOWN",
      actualCardBalance: null,
      ledgerAvailableBalance: null,
      displayAvailableBalance: null,
      unresolvedShortage: null,
      lastRefreshStatus: null,
      lastRefreshedAt: null,
      balanceAdjustmentInProgress: false,
    },
    {
      cardBalanceAccountId: accountId,
      academyId: "22222222-2222-4222-8222-222222222222",
      balanceKnowledge: "KNOWN",
      actualCardBalance: 120_000,
      ledgerAvailableBalance: 90_000,
      displayAvailableBalance: 90_000,
      unresolvedShortage: 0,
      lastRefreshStatus: "SUCCESS",
      lastRefreshedAt: "2026-08-21T00:00:00Z",
      balanceAdjustmentInProgress: true,
    },
  ] as const)("preserves the $balanceKnowledge projection", async (account) => {
    let captured: Request | undefined;
    const client = createClient<paths>({
      baseUrl: "https://backend.test",
      fetch: async (request) => {
        captured = request;
        return jsonResponse(200, account);
      },
    });

    await expect(getCardBalanceAccount(client, {
      cardBalanceAccountId: accountId,
    })).resolves.toEqual({ ok: true, data: account });
    expect(captured?.url).toBe(
      `https://backend.test/v1/card-balance-accounts/${accountId}`,
    );
    expect(captured?.headers.get("authorization")).toBeNull();
  });

  it("returns a normalized declared backend failure", async () => {
    const error = {
      error: {
        code: "CARD_BALANCE_ACCOUNT_NOT_FOUND",
        message: "Account not found",
        retryable: false,
        traceId: "trace-2",
        fieldErrors: [],
        details: {},
      },
    };
    const client = createClient<paths>({
      baseUrl: "https://backend.test",
      fetch: async () => jsonResponse(404, error),
    });

    await expect(getCardBalanceAccount(client, {
      cardBalanceAccountId: accountId,
    })).resolves.toEqual({
      ok: false,
      error: {
        kind: "backend",
        status: 404,
        code: "CARD_BALANCE_ACCOUNT_NOT_FOUND",
        message: "Account not found",
        retryable: false,
        traceId: "trace-2",
        fieldErrors: [],
        details: {},
      },
    });
  });

  it("requests the authenticated student's account page", async () => {
    const page = {
      items: [
        {
          cardBalanceAccountId: accountId,
          academyId: "22222222-2222-4222-8222-222222222222",
          balanceKnowledge: "UNKNOWN",
          actualCardBalance: null,
          ledgerAvailableBalance: null,
          displayAvailableBalance: null,
          unresolvedShortage: null,
          lastRefreshStatus: null,
          lastRefreshedAt: null,
          balanceAdjustmentInProgress: false,
        },
      ],
      nextCursor: null,
    } as const;
    let captured: Request | undefined;
    const client = createClient<paths>({
      baseUrl: "https://backend.test",
      fetch: async (request) => {
        captured = request;
        return jsonResponse(200, page);
      },
    });

    await expect(listMyCardBalanceAccounts(client)).resolves.toEqual({
      ok: true,
      data: page,
    });
    expect(captured?.url).toBe("https://backend.test/v1/me/card-balance-accounts");
  });
});

function jsonResponse(status: number, value: unknown) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
