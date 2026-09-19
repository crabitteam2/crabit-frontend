import { afterEach, describe, expect, it, vi } from "vitest";
import { behaviorRead } from "./behavior-session";
afterEach(() => vi.unstubAllGlobals());
describe("behaviorRead typed errors", () => {
  it.each([
    [
      410,
      { error: { code: "RECOMMENDATION_CURSOR_EXPIRED" } },
      "RECOMMENDATION_CURSOR_EXPIRED",
    ],
    [503, { code: "BFF_UPSTREAM_UNAVAILABLE" }, "BFF_UPSTREAM_UNAVAILABLE"],
    [403, {}, undefined],
  ])(
    "preserves status %s and nested or flat code",
    async (status, body, code) => {
      vi.stubGlobal(
        "fetch",
        vi
          .fn()
          .mockResolvedValue(Response.json(body, { status: status as number })),
      );
      await expect(
        behaviorRead(
          { contextId: "context", academyId: "academy" },
          "feed-results",
        ),
      ).rejects.toMatchObject({ status, code });
    },
  );
  it("does not invalidate a new session for an aborted old read", async () => {
    const controller = new AbortController();
    controller.abort();
    const listener = vi.fn();
    window.addEventListener("crabit-context-invalid", listener);
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ code: "BEHAVIOR_CONTEXT_MISMATCH" }, { status: 409 }),
        ),
    );
    await expect(
      behaviorRead({ contextId: "old", academyId: "academy" }, "feed-results", {
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({ status: 409 });
    expect(listener).not.toHaveBeenCalled();
    window.removeEventListener("crabit-context-invalid", listener);
  });
});
