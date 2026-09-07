/** 개발·검증 시 선택할 수 있는 고정 persona 목록입니다. */
export const PERSONAS = [
  "owner",
  "friend",
  "nonfriend",
  "blocked",
  "other-academy",
  "staff",
] as const;

/** 지원되는 persona 식별자입니다. */
export type Persona = (typeof PERSONAS)[number];

/** 알 수 없는 값이 지원되는 persona인지 검사합니다. */
export function isPersona(value: unknown): value is Persona {
  return (
    typeof value === "string" &&
    PERSONAS.some((candidate) => candidate === value)
  );
}

/**
 * 모든 요청이 사용하는 고정 persona입니다.
 *
 * 실제 인증 모델이 없어 쿠키 값과 무관하게 이 신원으로 백엔드를 호출합니다.
 */
export const FIXED_PERSONA: Persona = "owner";
