import createClient from "openapi-fetch";
import { describe, expect, it } from "vitest";

import type { components, paths } from "./generated/crabit-backend";
import {
  abandonWish,
  createWish,
  deleteWish,
  getRepresentativeWish,
  getWish,
  listWishes,
  patchWish,
  selectRepresentativeWish,
} from "./wishes";

const accountId = "11111111-1111-4111-8111-111111111111";
const wishId = "22222222-2222-4222-8222-222222222222";
const mutationResult: components["schemas"]["WishMutationResult"] = {
  eventId: "33333333-3333-4333-8333-333333333333",
  wish: {
    abandonmentAmount: null,
    actualDurationSeconds: null,
    amount: 40_000,
    balanceAdjustmentInProgress: true,
    cardBalanceAccountId: accountId,
    closedAt: null,
    completedAt: null,
    createdAt: "2026-08-21T00:00:00Z",
    id: wishId,
    photo: null,
    purpose: "노트북",
    startDate: null,
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
      body: {
        purpose: "노트북",
        targetAmount: 100_000,
        targetDate: null,
        photoId: "9a8b7c6d-5e4f-4321-9876-1234567890ab",
      },
    })).resolves.toEqual({ ok: true, data: mutationResult });

    expect(captured[0].method).toBe("POST");
    expect(captured[0].url).toBe(
      `https://backend.test/v1/card-balance-accounts/${accountId}/wishes`,
    );
    expect(captured[0].headers.get("idempotency-key")).toBe("create-key");
    expect(captured[0].headers.get("content-type")).toBe("application/json");
    await expect(captured[0].clone().json()).resolves.toMatchObject({
      photoId: "9a8b7c6d-5e4f-4321-9876-1234567890ab",
    });
  });

  it("fixes merge patch to application/merge-patch+json behind the typed helper", async () => {
    const captured: Request[] = [];
    const client = testClient(captured, mutationResult);

    await expect(patchWish(client, {
      cardBalanceAccountId: accountId,
      wishId,
      body: { expectedVersion: 3, targetDate: null, photoId: null },
    })).resolves.toEqual({ ok: true, data: mutationResult });

    expect(captured[0].method).toBe("PATCH");
    expect(captured[0].headers.get("content-type")).toBe(
      "application/merge-patch+json",
    );
    await expect(captured[0].clone().json()).resolves.toEqual({
      expectedVersion: 3,
      targetDate: null,
      photoId: null,
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

  it("posts the expected version and Idempotency-Key to the abandonment sub-resource", async () => {
    const captured: Request[] = [];
    const client = testClient(captured, mutationResult);

    await expect(abandonWish(client, {
      cardBalanceAccountId: accountId,
      wishId,
      idempotencyKey: "abandon-key",
      body: { expectedVersion: 3 },
    })).resolves.toEqual({ ok: true, data: mutationResult });

    expect(captured[0].method).toBe("POST");
    expect(captured[0].url).toBe(
      `https://backend.test/v1/card-balance-accounts/${accountId}/wishes/${wishId}/abandonment`,
    );
    expect(captured[0].headers.get("idempotency-key")).toBe("abandon-key");
    await expect(captured[0].clone().json()).resolves.toEqual({
      expectedVersion: 3,
    });
  });

  it("reads an optional representative Wish and selects one without mutation headers", async () => {
    const captured: Request[] = [];
    const selectedWish = mutationResult.wish;
    const selectedClient = testClient(captured, selectedWish);

    await expect(getRepresentativeWish(selectedClient, {
      cardBalanceAccountId: accountId,
    })).resolves.toEqual({ ok: true, data: selectedWish });

    const emptyClient = testClient(captured, undefined, 204);
    await expect(getRepresentativeWish(emptyClient, {
      cardBalanceAccountId: accountId,
    })).resolves.toEqual({ ok: true, data: undefined });

    const selectionClient = testClient(captured, selectedWish);
    await expect(selectRepresentativeWish(selectionClient, {
      cardBalanceAccountId: accountId,
      body: { wishId },
    })).resolves.toEqual({ ok: true, data: selectedWish });

    expect(captured.map(({ method }) => method)).toEqual(["GET", "GET", "PUT"]);
    expect(captured[0].url).toBe(
      `https://backend.test/v1/card-balance-accounts/${accountId}/representative-wish`,
    );
    expect(captured[1].url).toBe(captured[0].url);
    expect(captured[2].url).toBe(captured[0].url);
    await expect(captured[2].clone().json()).resolves.toEqual({ wishId });
    expect(captured[2].headers.get("idempotency-key")).toBeNull();
    expect(captured[2].headers.get("if-match")).toBeNull();
    expect(captured[2].headers.get("authorization")).toBeNull();
  });

  it.each([
    ["get", 400, "MALFORMED_REQUEST"],
    ["get", 401, "AUTH_REQUIRED"],
    ["get", 403, "FORBIDDEN"],
    ["get", 404, "CARD_BALANCE_ACCOUNT_NOT_FOUND"],
    ["select", 404, "WISH_NOT_FOUND"],
    ["select", 409, "INVALID_STATE_TRANSITION"],
    ["select", 415, "UNSUPPORTED_MEDIA_TYPE"],
  ] as const)("normalizes representative-Wish %s status %i", async (
    operation,
    status,
    code,
  ) => {
    const captured: Request[] = [];
    const client = testClient(captured, errorEnvelope(code), status);

    const result = operation === "get"
      ? await getRepresentativeWish(client, { cardBalanceAccountId: accountId })
      : await selectRepresentativeWish(client, {
        cardBalanceAccountId: accountId,
        body: { wishId },
      });

    expect(result).toEqual({
      ok: false,
      error: {
        kind: "backend",
        status,
        code,
        message: `${code} message`,
        retryable: false,
        traceId: `trace-${status}`,
        fieldErrors: [],
        details: {},
      },
    });
  });
});

function testClient(captured: Request[], body: unknown = {}, status = 200) {
  return createClient<paths>({
    baseUrl: "https://backend.test",
    fetch: async (request) => {
      captured.push(request);
      if (status === 204) {
        return new Response(null, { status });
      }
      return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    },
  });
}

function errorEnvelope(code: components["schemas"]["ErrorCode"]) {
  const statusByCode: Partial<Record<components["schemas"]["ErrorCode"], number>> = {
    AUTH_REQUIRED: 401,
    CARD_BALANCE_ACCOUNT_NOT_FOUND: 404,
    FORBIDDEN: 403,
    INVALID_STATE_TRANSITION: 409,
    MALFORMED_REQUEST: 400,
    UNSUPPORTED_MEDIA_TYPE: 415,
    WISH_NOT_FOUND: 404,
  };
  const status = statusByCode[code];
  if (status === undefined) {
    throw new Error(`Missing test status for ${code}`);
  }
  return {
    error: {
      code,
      message: `${code} message`,
      retryable: false,
      traceId: `trace-${status}`,
      fieldErrors: [],
      details: {},
    },
  };
}
