import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  PERSONA_TOKEN_VARIABLES,
  PersonaTokenConfigurationError,
  readPersonaTokenConfiguration,
} from "./persona-tokens";
import { PERSONAS } from "../lib/persona/persona";

describe("readPersonaTokenConfiguration", () => {
  it.each(["e2e", "demo"] as const)(
    "loads all six canonical personas from only the active %s namespace",
    (namespace) => {
      const values = registryEnvironment(namespace);
      const configuration = readPersonaTokenConfiguration(namespace, values);

      expect(Object.keys(configuration.active ?? {})).toEqual(PERSONAS);
      expect(configuration[namespace]).toEqual(configuration.active);
      expect(configuration[namespace === "e2e" ? "demo" : "e2e"]).toBeNull();
    },
  );

  it.each([undefined, "", " ", "value with whitespace", "line\nbreak"])(
    "rejects a missing or malformed active credential without disclosing it: %j",
    (invalidValue) => {
      const values = registryEnvironment("e2e");
      const variable = PERSONA_TOKEN_VARIABLES.e2e.friend;
      values[variable] = invalidValue;

      expectSecretFreeFailure(() => readPersonaTokenConfiguration("e2e", values), invalidValue);
    },
  );

  it("rejects duplicate values within a namespace", () => {
    const values = registryEnvironment("demo");
    values[PERSONA_TOKEN_VARIABLES.demo.friend] = values[PERSONA_TOKEN_VARIABLES.demo.owner];

    expectSecretFreeFailure(() => readPersonaTokenConfiguration("demo", values));
  });

  it("requires an inactive namespace to be complete when any of it is configured", () => {
    const values = registryEnvironment("e2e");
    values[PERSONA_TOKEN_VARIABLES.demo.owner] = runtimeToken("inactive-owner");

    expectSecretFreeFailure(() => readPersonaTokenConfiguration("e2e", values));
  });

  it("rejects values reused across complete E2E and Demo namespaces", () => {
    const values = {
      ...registryEnvironment("e2e"),
      ...registryEnvironment("demo"),
    };
    values[PERSONA_TOKEN_VARIABLES.demo.staff] = values[PERSONA_TOKEN_VARIABLES.e2e.owner];

    expectSecretFreeFailure(() => readPersonaTokenConfiguration("e2e", values));
  });

  it("rejects every configured synthetic namespace for the prod backend profile", () => {
    const values = {
      [PERSONA_TOKEN_VARIABLES.e2e.owner]: runtimeToken("unexpected"),
    };

    expectSecretFreeFailure(() => readPersonaTokenConfiguration("prod", values));
  });

  it("returns no synthetic registry for an unconfigured prod profile", () => {
    expect(readPersonaTokenConfiguration("prod", {})).toEqual({
      e2e: null,
      demo: null,
      active: null,
    });
  });
});

function registryEnvironment(namespace: "e2e" | "demo") {
  return Object.fromEntries(PERSONAS.map((persona) => [
    PERSONA_TOKEN_VARIABLES[namespace][persona],
    runtimeToken(`${namespace}-${persona}`),
  ])) as Record<string, string | undefined>;
}

function runtimeToken(label: string) {
  return `${label}-${randomUUID()}`;
}

function expectSecretFreeFailure(action: () => unknown, secret?: string) {
  try {
    action();
    throw new Error("Expected credential validation to fail");
  } catch (error) {
    expect(error).toBeInstanceOf(PersonaTokenConfigurationError);
    expect(String(error)).toBe(
      "PersonaTokenConfigurationError: Persona credential configuration is invalid",
    );
    if (secret && secret.length > 2) {
      expect(String(error)).not.toContain(secret);
    }
  }
}
