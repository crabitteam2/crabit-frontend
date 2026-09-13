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
export const DEMO_GRADE_PERSONAS = ["grade-3", "grade-4", "grade-5", "grade-6"] as const;
export type BasePersona = (typeof PERSONAS)[number];
export type DemoGradePersona = (typeof DEMO_GRADE_PERSONAS)[number];
export type Persona = BasePersona | DemoGradePersona;

/** 알 수 없는 값이 지원되는 persona인지 검사합니다. */
export function isPersona(value: unknown): value is Persona {
  return (
    typeof value === "string" &&
    [...PERSONAS, ...DEMO_GRADE_PERSONAS].some((candidate) => candidate === value)
  );
}

/** 선택 쿠키가 아예 없는 기존 진입의 기본 신원입니다. */
export const FIXED_PERSONA: Persona = "owner";
