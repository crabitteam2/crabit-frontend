import { describe, expect, it } from "vitest";

import {
  apiResult,
  FrontendRequestError,
  unwrapResult,
} from "./result";

describe("ApiResult boundary", () => {
  it("returns success data unchanged and unwraps it", async () => {
    const data = { balanceAdjustmentInProgress: true };
    const result = await apiResult(async () => ({
      data,
      response: jsonResponse(200, data),
    }));

    expect(result).toEqual({ ok: true, data });
    expect(unwrapResult(result)).toBe(data);
  });

  it.each([
    ["backend", 404, {
      error: {
        code: "WISH_NOT_FOUND",
        message: "Wish not found",
        retryable: false,
        traceId: "trace-1",
        fieldErrors: [],
        details: {},
      },
    }, "WISH_NOT_FOUND"],
    ["bff", 404, { code: "BFF_NOT_FOUND", message: "BFF route is not found" }, "BFF_NOT_FOUND"],
    ["malformed", 502, { secret: "raw-token-value" }, "MALFORMED_RESPONSE"],
  ] as const)("normalizes %s failures without rejecting", async (kind, status, body, code) => {
    const result = await apiResult(async () => ({
      error: body,
      response: jsonResponse(status, body),
    }));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe(kind);
      expect(result.error.code).toBe(code);
      expect(JSON.stringify(result)).not.toContain("raw-token-value");
    }
  });

  it("sanitizes rejected requests and thrown unwrap errors", async () => {
    const result = await apiResult<{ never: true }>(async () => {
      throw new Error("Bearer raw-secret-token");
    });

    expect(result).toEqual({
      ok: false,
      error: {
        kind: "network",
        code: "NETWORK_ERROR",
        message: "Backend request failed",
        retryable: true,
      },
    });
    expect(() => unwrapResult(result)).toThrow(FrontendRequestError);
    if (result.ok) {
      throw new Error("Expected a network failure");
    }
    try {
      unwrapResult(result);
    } catch (error) {
      expect(error).toBeInstanceOf(FrontendRequestError);
      expect(JSON.stringify(error)).not.toContain("raw-secret-token");
      expect((error as FrontendRequestError).httpError).toEqual(result.error);
    }
  });
});

function jsonResponse(status: number, value: unknown) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
