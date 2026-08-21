import createClient from "openapi-fetch";
import { describe, expect, it } from "vitest";

import type { components, paths } from "./generated/crabit-backend";
import {
  createWish,
  deleteWish,
  getWish,
  listWishes,
  patchWish,
} from "./wishes";

const accountId = "11111111-1111-4111-8111-111111111111";
const wishId = "22222222-2222-4222-8222-222222222222";
const mutationResult: components["schemas"]["WishMutationResult"] = {
  eventId: "33333333-3333-4333-8333-333333333333",
  wish: {
    actualDurationSeconds: null,
    amount: 40_000,
    balanceAdjustmentInProgress: true,
    cardBalanceAccountId: accountId,
    completedAt: null,
    createdAt: "2026-08-21T00:00:00Z",
    id: wishId,
    purpose: "노트북",
    state: "IN_PROGRESS",
    targetAmount: 100_000,
    targetDate: null,
    updatedAt: "2026-08-21T00:01:00Z",
    version: 3,
    visibility: "PRIVATE",
  },
};

describe("Wish typed request helpers", () => {
  it("lists and gets wishes through generated paths while preserving typed data", async () => {
    const captured: Request[] = [];
    const page = { items: [], nextCursor: "opaque-next" };
    const client = testClient(captured, page);

    await expect(listWishes(client, {
      cardBalanceAccountId: accountId,
      cursor: "opaque-current",
      limit: 20,
      state: ["IN_PROGRESS", "COMPLETED"],
    })).resolves.toEqual({ ok: true, data: page });

    expect(captured[0].url).toContain(`/${accountId}/wishes?`);
    expect(captured[0].url).toContain("cursor=opaque-current");
    expect(captured[0].url).toContain("state=IN_PROGRESS");
    expect(captured[0].url).toContain("state=COMPLETED");

    const wish = { id: wishId, balanceAdjustmentInProgress: true };
    const detailClient = testClient(captured, wish);
    await expect(getWish(detailClient, {
      cardBalanceAccountId: accountId,
      wishId,
    })).resolves.toEqual({ ok: true, data: wish });
    expect(captured[1].url).toBe(
      `https://backend.test/v1/card-balance-accounts/${accountId}/wishes/${wishId}`,
    );
  });

  it("expresses Idempotency-Key through the generated create operation", async () => {
    const captured: Request[] = [];
    const client = testClient(captured, mutationResult);

    await expect(createWish(client, {
      cardBalanceAccountId: accountId,
      idempotencyKey: "create-key",
      body: { purpose: "노트북", targetAmount: 100_000, targetDate: null },
    })).resolves.toEqual({ ok: true, data: mutationResult });

    expect(captured[0].method).toBe("POST");
    expect(captured[0].url).toBe(
      `https://backend.test/v1/card-balance-accounts/${accountId}/wishes`,
    );
    expect(captured[0].headers.get("idempotency-key")).toBe("create-key");
    expect(captured[0].headers.get("content-type")).toBe("application/json");
  });

  it("fixes merge patch to application/merge-patch+json behind the typed helper", async () => {
    const captured: Request[] = [];
    const client = testClient(captured, mutationResult);

    await expect(patchWish(client, {
      cardBalanceAccountId: accountId,
      wishId,
      body: { expectedVersion: 3, targetDate: null },
    })).resolves.toEqual({ ok: true, data: mutationResult });

    expect(captured[0].method).toBe("PATCH");
    expect(captured[0].headers.get("content-type")).toBe(
      "application/merge-patch+json",
    );
    await expect(captured[0].clone().json()).resolves.toEqual({
      expectedVersion: 3,
      targetDate: null,
    });
  });

  it("expresses If-Match and Idempotency-Key through the generated delete operation", async () => {
    const captured: Request[] = [];
    const client = testClient(captured, mutationResult);

    await expect(deleteWish(client, {
      cardBalanceAccountId: accountId,
      wishId,
      idempotencyKey: "delete-key",
      ifMatch: 7,
    })).resolves.toEqual({ ok: true, data: mutationResult });

    expect(captured[0].method).toBe("DELETE");
    expect(captured[0].headers.get("idempotency-key")).toBe("delete-key");
    expect(captured[0].headers.get("if-match")).toBe("7");
  });
});

function testClient(captured: Request[], body: unknown = {}) {
  return createClient<paths>({
    baseUrl: "https://backend.test",
    fetch: async (request) => {
      captured.push(request);
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  });
}
