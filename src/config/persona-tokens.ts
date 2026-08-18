import "server-only";

import type { BackendProfile, PersonaNamespace } from "./profile-policy";
import { PERSONAS, type Persona } from "../lib/persona/persona";

export type PersonaTokenRegistry = Readonly<Record<Persona, string>>;

export interface PersonaTokenConfiguration {
  readonly e2e: PersonaTokenRegistry | null;
  readonly demo: PersonaTokenRegistry | null;
  readonly active: PersonaTokenRegistry | null;
}

export const PERSONA_TOKEN_VARIABLES: Readonly<
  Record<PersonaNamespace, Readonly<Record<Persona, string>>>
> = {
  e2e: {
    owner: "E2E_OWNER_TOKEN",
    friend: "E2E_FRIEND_TOKEN",
    nonfriend: "E2E_NONFRIEND_TOKEN",
    blocked: "E2E_BLOCKED_TOKEN",
    "other-academy": "E2E_OTHER_ACADEMY_TOKEN",
    staff: "E2E_STAFF_TOKEN",
  },
  demo: {
    owner: "CRABIT_DEMO_TOKEN_OWNER",
    friend: "CRABIT_DEMO_TOKEN_FRIEND",
    nonfriend: "CRABIT_DEMO_TOKEN_NONFRIEND",
    blocked: "CRABIT_DEMO_TOKEN_BLOCKED",
    "other-academy": "CRABIT_DEMO_TOKEN_OTHER_ACADEMY",
    staff: "CRABIT_DEMO_TOKEN_STAFF",
  },
};

export class PersonaTokenConfigurationError extends Error {
  constructor() {
    super("Persona credential configuration is invalid");
    this.name = "PersonaTokenConfigurationError";
  }
}

export function readPersonaTokenConfiguration(
  backendProfile: BackendProfile,
  values: Readonly<Record<string, string | undefined>> = process.env,
): PersonaTokenConfiguration {
  const e2eConfigured = hasConfiguredValue("e2e", values);
  const demoConfigured = hasConfiguredValue("demo", values);

  if (backendProfile === "prod" && (e2eConfigured || demoConfigured)) {
    throw new PersonaTokenConfigurationError();
  }

  const e2e = backendProfile === "e2e" || e2eConfigured
    ? readRegistry("e2e", values)
    : null;
  const demo = backendProfile === "demo" || demoConfigured
    ? readRegistry("demo", values)
    : null;

  if (e2e !== null && demo !== null) {
    const e2eValues = new Set(Object.values(e2e));
    if (Object.values(demo).some((token) => e2eValues.has(token))) {
      throw new PersonaTokenConfigurationError();
    }
  }

  return {
    e2e,
    demo,
    active: backendProfile === "e2e" ? e2e : backendProfile === "demo" ? demo : null,
  };
}

function hasConfiguredValue(
  namespace: PersonaNamespace,
  values: Readonly<Record<string, string | undefined>>,
) {
  return PERSONAS.some(
    (persona) => values[PERSONA_TOKEN_VARIABLES[namespace][persona]] !== undefined,
  );
}

function readRegistry(
  namespace: PersonaNamespace,
  values: Readonly<Record<string, string | undefined>>,
): PersonaTokenRegistry {
  const entries = PERSONAS.map((persona) => {
    const token = values[PERSONA_TOKEN_VARIABLES[namespace][persona]];
    if (
      token === undefined
      || token.length === 0
      || /\s/u.test(token)
      || hasControlCharacter(token)
    ) {
      throw new PersonaTokenConfigurationError();
    }
    return [persona, token] as const;
  });

  if (new Set(entries.map(([, token]) => token)).size !== PERSONAS.length) {
    throw new PersonaTokenConfigurationError();
  }

  return Object.fromEntries(entries) as PersonaTokenRegistry;
}

function hasControlCharacter(value: string) {
  return [...value].some((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint <= 0x1f || codePoint === 0x7f;
  });
}
