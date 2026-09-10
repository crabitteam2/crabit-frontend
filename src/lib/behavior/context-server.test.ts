import { expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { currentContext, handleBehaviorContext } from "./context-server";
import { handlePersonaRoute } from "../persona/route";
import { proxyBackendRequest } from "../bff/proxy";
import { resolveProfilePolicy } from "../../config/profile-policy";
import type { BffEnvironment } from "../../config/env";
const academy = "11111111-1111-4111-8111-111111111111";
const environment = {
  backendProfile: "e2e",
  appEnv: "e2e",
  backendUrl: new URL("http://backend.test"),
  profilePolicy: resolveProfilePolicy("e2e", "e2e"),
} as BffEnvironment;
const tokens = { active: { owner: "owner-token", friend: "friend-token" } };
function dependencies(
  fetchImpl = vi
    .fn()
    .mockResolvedValue(Response.json({ items: [{ academyId: academy }] })),
) {
  return {
    loadEnvironment: () => environment,
    loadTokens: () => tokens as never,
    fetchImpl,
  };
}
function cookie(response: Response) {
  return response.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
}
it("rotates epoch for A to B to A and rejects stale collection before upstream", async () => {
  const select = (persona: string) =>
    handlePersonaRoute(
      new Request("http://app/api/e2e/persona", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ persona }),
      }),
      "e2e",
      dependencies(),
    );
  const a = await select("owner");
  const b = await select("friend");
  const a2 = await select("owner");
  expect(cookie(a2)).not.toBe(cookie(a));
  expect(cookie(b)).not.toBe(cookie(a));
  const response = await handleBehaviorContext(
    new Request("http://app/api/behavior/context", {
      method: "POST",
      headers: { cookie: cookie(a), "content-type": "application/json" },
      body: JSON.stringify({ academyId: academy }),
    }),
    dependencies(),
  );
  expect(response.headers.getSetCookie()).toHaveLength(1);
  expect(response.headers.getSetCookie()[0]).toMatch(
    /^crabit-e2e-academy-context=/,
  );
  const context = await response.json();
  const staleCookies =
    cookie(a2)
      .split(";")
      .filter((part) => !part.trim().startsWith("crabit-e2e-academy-context="))
      .join(";") +
    "; " +
    cookie(response);
  const fetcher = vi.fn();
  const result = await proxyBackendRequest(
    new Request("http://app/api/backend", {
      method: "POST",
      headers: {
        cookie: staleCookies,
        "X-Crabit-Behavior-Context": context.contextId,
      },
      body: "{}",
    }),
    ["v1", "academies", academy, "profile-visits"],
    dependencies(fetcher),
  );
  expect(result.status).toBe(409);
  expect(fetcher).not.toHaveBeenCalled();
});
it("legacy bootstrap never overwrites a later Persona epoch and malformed context fails closed", async () => {
  const response = await handleBehaviorContext(
    new Request("http://app/api/behavior/context", {
      method: "POST",
      headers: {
        cookie: "crabit-e2e-persona=owner",
        "content-type": "application/json",
      },
      body: JSON.stringify({ academyId: academy }),
    }),
    dependencies(),
  );
  expect(response.status).toBe(200);
  expect(
    response.headers
      .getSetCookie()
      .some((value) => value.startsWith("crabit-e2e-epoch=")),
  ).toBe(false);
  expect(
    currentContext(
      new Headers({
        cookie:
          "crabit-e2e-persona=owner; crabit-e2e-epoch=x; crabit-e2e-epoch=y",
      }),
      environment,
      academy,
    ),
  ).toBeNull();
  const invalid = await handleBehaviorContext(
    new Request("http://app/api/behavior/context", {
      method: "POST",
      headers: { cookie: "crabit-e2e-persona=owner" },
      body: JSON.stringify({ academyId: academy }),
    }),
    dependencies(),
  );
  expect(invalid.status).toBe(400);
});
