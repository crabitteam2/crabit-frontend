import { describe, expect, it } from "vitest";

import {
  normalizeErrorResponse,
  normalizeNetworkFailure,
} from "./errors";

describe("frontend HTTP error normalization", () => {
  it("preserves only the validated nested backend error contract", async () => {
    const response = jsonResponse(503, {
      error: {
        code: "BALANCE_SYNC_FAILED",
        message: "Card balance synchronization failed.",
        retryable: true,
        traceId: "22222222-2222-4222-8222-222222222222",
        fieldErrors: [{ field: "amount", message: "must be positive" }],
        details: { provider: "seed" },
      },
    });

    await expect(normalizeErrorResponse(response)).resolves.toEqual({
      kind: "backend",
      status: 503,
      code: "BALANCE_SYNC_FAILED",
      message: "Card balance synchronization failed.",
      retryable: true,
      traceId: "22222222-2222-4222-8222-222222222222",
      fieldErrors: [{ field: "amount", message: "must be positive" }],
      details: { provider: "seed" },
    });
  });

  it("recognizes only documented exact flat BFF envelopes", async () => {
    const response = jsonResponse(404, {
      code: "BFF_NOT_FOUND",
      message: "BFF route is not found",
    });

    await expect(normalizeErrorResponse(response)).resolves.toEqual({
      kind: "bff",
      status: 404,
      code: "BFF_NOT_FOUND",
      message: "BFF route is not found",
    });
  });

  it.each([
    new Response("<html>upstream detail</html>", {
      status: 502,
      headers: { "Content-Type": "text/html" },
    }),
    new Response("{", {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }),
    jsonResponse(500, { code: "UNKNOWN_CODE", message: "unsafe", extra: "secret" }),
    jsonResponse(400, {
      error: {
        code: "AUTH_REQUIRED",
        message: "Authentication required",
        retryable: false,
        traceId: "trace",
        fieldErrors: [],
        details: {},
        extra: "secret",
      },
    }),
  ])("maps malformed or untrusted response %# to a safe fixed error", async (response) => {
    const normalized = await normalizeErrorResponse(response);

    expect(normalized).toEqual({
      kind: "malformed",
      status: response.status,
      code: "MALFORMED_RESPONSE",
      message: "Backend response is invalid",
      retryable: false,
    });
    expect(JSON.stringify(normalized)).not.toContain("unsafe");
    expect(JSON.stringify(normalized)).not.toContain("secret");
  });

  it("discards network exception text and reports a retryable safe error", () => {
    expect(normalizeNetworkFailure()).toEqual({
      kind: "network",
      code: "NETWORK_ERROR",
      message: "Backend request failed",
      retryable: true,
    });
  });
});

function jsonResponse(status: number, value: unknown) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
