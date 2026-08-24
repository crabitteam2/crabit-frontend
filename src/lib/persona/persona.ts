export const PERSONAS = [
  "owner",
  "friend",
  "nonfriend",
  "blocked",
  "other-academy",
  "staff",
] as const;

export type Persona = (typeof PERSONAS)[number];

export function isPersona(value: unknown): value is Persona {
  return typeof value === "string"
    && PERSONAS.some((candidate) => candidate === value);
}
