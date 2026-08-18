import createClient from "openapi-fetch";
import { describe, expect, it } from "vitest";

import type { paths } from "./generated/crabit-backend";
import { createWish, deleteWish, patchWish } from "./wishes";

const accountId = "11111111-1111-4111-8111-111111111111";
const wishId = "22222222-2222-4222-8222-222222222222";

describe("Wish typed request helpers", () => {
  it("expresses Idempotency-Key through the generated create operation", async () => {
    const captured: Request[] = [];
    const client = testClient(captured);

    await createWish(client, {
      cardBalanceAccountId: accountId,
      idempotencyKey: "create-key",
      body: { purpose: "노트북", targetAmount: 100_000, targetDate: null },
    });

    expect(captured[0].method).toBe("POST");
    expect(captured[0].url).toBe(
      `https://backend.test/v1/card-balance-accounts/${accountId}/wishes`,
    );
    expect(captured[0].headers.get("idempotency-key")).toBe("create-key");
    expect(captured[0].headers.get("content-type")).toBe("application/json");
  });

  it("fixes merge patch to application/merge-patch+json behind the typed helper", async () => {
    const captured: Request[] = [];
    const client = testClient(captured);

    await patchWish(client, {
      cardBalanceAccountId: accountId,
      wishId,
      body: { expectedVersion: 3, targetDate: null },
    });

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
    const client = testClient(captured);

    await deleteWish(client, {
      cardBalanceAccountId: accountId,
      wishId,
      idempotencyKey: "delete-key",
      ifMatch: 7,
    });

    expect(captured[0].method).toBe("DELETE");
    expect(captured[0].headers.get("idempotency-key")).toBe("delete-key");
    expect(captured[0].headers.get("if-match")).toBe("7");
  });
});

function testClient(captured: Request[]) {
  return createClient<paths>({
    baseUrl: "https://backend.test",
    fetch: async (request) => {
      captured.push(request);
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  });
}
