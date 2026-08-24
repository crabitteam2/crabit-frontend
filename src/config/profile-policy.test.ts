import { describe, expect, it } from "vitest";

import {
  APP_ENVIRONMENTS,
  BACKEND_PROFILES,
  ProfilePolicyError,
  resolveProfilePolicy,
} from "./profile-policy";

const allowed = new Set([
  "local/e2e",
  "local/demo",
  "local/prod",
  "e2e/e2e",
  "staging/e2e",
  "prod/demo",
]);

describe("resolveProfilePolicy", () => {
  it.each(APP_ENVIRONMENTS.flatMap(
    (appEnv) => BACKEND_PROFILES.map((backendProfile) => [appEnv, backendProfile] as const),
  ))("enforces the closed %s/%s compatibility matrix", (appEnv, backendProfile) => {
    const key = `${appEnv}/${backendProfile}`;
    if (!allowed.has(key)) {
      expect(() => resolveProfilePolicy(appEnv, backendProfile)).toThrowError(
        new ProfilePolicyError(),
      );
      return;
    }

    const policy = resolveProfilePolicy(appEnv, backendProfile);
    expect(policy.appEnv).toBe(appEnv);
    expect(policy.backendProfile).toBe(backendProfile);
    expect(policy.allowsE2eUpstream).toBe(backendProfile === "e2e");
  });

  it("keeps E2E, Demo, and production capabilities isolated", () => {
    expect(resolveProfilePolicy("local", "e2e")).toMatchObject({
      credentialNamespace: "e2e",
      personaCookieName: "crabit-e2e-persona",
      personaRoute: "/api/e2e/persona",
    });
    expect(resolveProfilePolicy("prod", "demo")).toMatchObject({
      credentialNamespace: "demo",
      personaCookieName: "crabit-demo-persona",
      personaRoute: "/api/demo/persona",
    });
    expect(resolveProfilePolicy("local", "prod")).toMatchObject({
      credentialNamespace: null,
      personaCookieName: null,
      personaRoute: null,
    });
  });

  it.each([
    [undefined, "e2e"],
    ["", "e2e"],
    ["LOCAL", "e2e"],
    ["local", undefined],
    ["local", ""],
    ["local", "E2E"],
  ])("fails closed for unknown values %j/%j", (appEnv, backendProfile) => {
    expect(() => resolveProfilePolicy(appEnv, backendProfile)).toThrowError(
      new ProfilePolicyError(),
    );
  });
});
