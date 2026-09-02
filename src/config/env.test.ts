import { readFileSync } from "node:fs";

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  BffConfigurationError,
  readBffEnvironment,
} from "./env";

describe("readBffEnvironment", () => {
  it("accepts every required assignment from the checked-in environment example", () => {
    const example = readFileSync(
      new URL("../../.env.example", import.meta.url),
      "utf8",
    );
    const assignments = Object.fromEntries(
      example
        .split(/\r?\n/)
        .filter((line) => /^[A-Z][A-Z0-9_]*=/.test(line))
        .map((line) => {
          const separator = line.indexOf("=");
          return [line.slice(0, separator), line.slice(separator + 1)];
        }),
    );

    const environment = readBffEnvironment(assignments);

    expect(environment.appEnv).toBe("local");
    expect(environment.backendProfile).toBe("prod");
    expect(environment.backendUrl.href).toBe("http://127.0.0.1:8080/");
  });

  it.each([
    ["local", "e2e"],
    ["local", "demo"],
    ["local", "prod"],
    ["e2e", "e2e"],
    ["staging", "e2e"],
    ["prod", "demo"],
  ] as const)(
    "accepts the documented %s/%s profile pair",
    (appEnv, backendProfile) => {
      const backendUrl = appEnv === "local" || appEnv === "e2e"
        ? "http://127.0.0.1:18080"
        : "https://backend.example:8443";

      const environment = readBffEnvironment({
        APP_ENV: appEnv,
        BACKEND_PROFILE: backendProfile,
        BACKEND_URL: backendUrl,
      });

      expect(environment.appEnv).toBe(appEnv);
      expect(environment.backendProfile).toBe(backendProfile);
      expect(environment.backendUrl.href).toBe(`${backendUrl}/`);
    },
  );

  it.each([
    undefined,
    "",
    " ",
    " local",
    "local ",
    "LOCAL",
    "development",
  ])("rejects an APP_ENV outside the exact enum: %j", (appEnv) => {
    expectConfigurationFailure({
      APP_ENV: appEnv,
      BACKEND_PROFILE: "e2e",
      BACKEND_URL: "http://127.0.0.1:18080",
    });
  });

  it.each([undefined, "", " ", "E2E", "production"])(
    "rejects an unknown BACKEND_PROFILE: %j",
    (backendProfile) => {
      expectConfigurationFailure({
        APP_ENV: "local",
        BACKEND_PROFILE: backendProfile,
        BACKEND_URL: "http://127.0.0.1:18080",
      });
    },
  );

  it.each([
    undefined,
    "",
    "not-a-url",
    "ftp://backend.example",
    "http://",
    "http://user@backend.example",
    "http://user:password@backend.example",
    "http://backend.example/api",
    "http://backend.example?",
    "http://backend.example?mode=test",
    "http://backend.example#",
    "http://backend.example#fragment",
    " http://backend.example",
    "http://backend.example ",
    "http://backend.example\n",
  ])("rejects an unsafe BACKEND_URL: %j", (backendUrl) => {
    expectConfigurationFailure({
      APP_ENV: "local",
      BACKEND_PROFILE: "prod",
      BACKEND_URL: backendUrl,
    });
  });

  it.each(["local", "e2e"] as const)(
    "allows HTTP for the %s environment",
    (appEnv) => {
      expect(
        readBffEnvironment({
          APP_ENV: appEnv,
          BACKEND_PROFILE: "e2e",
          BACKEND_URL: "http://backend.example:8080/",
        }).backendUrl.href,
      ).toBe("http://backend.example:8080/");
    },
  );

  it.each(["staging", "prod"] as const)(
    "requires HTTPS for the %s environment",
    (appEnv) => {
      expectConfigurationFailure({
        APP_ENV: appEnv,
        BACKEND_PROFILE: appEnv === "staging" ? "e2e" : "demo",
        BACKEND_URL: "http://backend.example",
      });
    },
  );

  it("is independent from NODE_ENV", () => {
    const environment = readBffEnvironment({
      APP_ENV: "e2e",
      BACKEND_PROFILE: "e2e",
      BACKEND_URL: "http://backend.example",
      NODE_ENV: "production",
    });

    expect(environment.appEnv).toBe("e2e");
  });

  it("never includes configuration names, values, or parser details in its error", () => {
    const secret = "http://secret-user:secret-password@secret.example/private";

    try {
      readBffEnvironment({
        APP_ENV: "production",
        BACKEND_PROFILE: "prod",
        BACKEND_URL: secret,
      });
      throw new Error("Expected configuration validation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(BffConfigurationError);
      expect(String(error)).toBe("BffConfigurationError: BFF configuration is invalid");
      expect(String(error)).not.toContain("APP_ENV");
      expect(String(error)).not.toContain("BACKEND_PROFILE");
      expect(String(error)).not.toContain("BACKEND_URL");
      expect(String(error)).not.toContain(secret);
    }
  });
});

function expectConfigurationFailure(
  values: Readonly<Record<string, string | undefined>>,
) {
  expect(() => readBffEnvironment(values)).toThrowError(
    new BffConfigurationError(),
  );
}
