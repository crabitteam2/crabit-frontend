import "server-only";

import type { BackendProfile, PersonaNamespace } from "./profile-policy";
import { PERSONAS, type Persona } from "../lib/persona/persona";

/** 모든 persona에 대응하는 서버 전용 Bearer 토큰 모음입니다. */
export type PersonaTokenRegistry = Readonly<Record<Persona, string>>;

/** e2e와 demo 토큰 집합 및 현재 프로필에서 활성화된 집합입니다. */
export interface PersonaTokenConfiguration {
  /** 완전하게 검증된 e2e 토큰 집합입니다. */
  readonly e2e: PersonaTokenRegistry | null;
  /** 완전하게 검증된 demo 토큰 집합입니다. */
  readonly demo: PersonaTokenRegistry | null;
  /** 현재 백엔드 프로필이 사용하는 토큰 집합입니다. */
  readonly active: PersonaTokenRegistry | null;
}

/** persona와 서버 환경 변수 이름의 프로필별 대응표입니다. */
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

/** persona 토큰 구성이 불완전하거나 안전 규칙을 위반했음을 나타냅니다. */
export class PersonaTokenConfigurationError extends Error {
  constructor() {
    super("Persona credential configuration is invalid");
    this.name = "PersonaTokenConfigurationError";
  }
}

/**
 * 서버 환경 변수에서 persona 토큰을 읽고 프로필별 레지스트리를 구성합니다.
 *
 * 일부 토큰만 설정된 경우, 빈 값·공백·제어 문자가 포함된 경우, 토큰이 중복된 경우를
 * 거부합니다. prod 프로필에서는 e2e와 demo 토큰이 하나라도 설정되어 있으면 실패합니다.
 *
 * @throws {@link PersonaTokenConfigurationError} 자격 증명 구성이 안전하지 않을 때 발생합니다.
 */
export function readPersonaTokenConfiguration(
  backendProfile: BackendProfile,
  values: Readonly<Record<string, string | undefined>> = process.env,
): PersonaTokenConfiguration {
  const e2eConfigured = hasConfiguredValue("e2e", values);
  const demoConfigured = hasConfiguredValue("demo", values);

  if (backendProfile === "prod" && (e2eConfigured || demoConfigured)) {
    throw new PersonaTokenConfigurationError();
  }

  const e2e =
    backendProfile === "e2e" || e2eConfigured
      ? readRegistry("e2e", values)
      : null;
  const demo =
    backendProfile === "demo" || demoConfigured
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
    active:
      backendProfile === "e2e" ? e2e : backendProfile === "demo" ? demo : null,
  };
}

function hasConfiguredValue(
  namespace: PersonaNamespace,
  values: Readonly<Record<string, string | undefined>>,
) {
  return PERSONAS.some(
    (persona) =>
      values[PERSONA_TOKEN_VARIABLES[namespace][persona]] !== undefined,
  );
}

function readRegistry(
  namespace: PersonaNamespace,
  values: Readonly<Record<string, string | undefined>>,
): PersonaTokenRegistry {
  const entries = PERSONAS.map((persona) => {
    const token = values[PERSONA_TOKEN_VARIABLES[namespace][persona]];
    if (
      token === undefined ||
      token.length === 0 ||
      /\s/u.test(token) ||
      hasControlCharacter(token)
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
