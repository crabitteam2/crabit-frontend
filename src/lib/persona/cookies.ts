import type { AppEnvironment, PersonaNamespace } from "../../config/profile-policy";
import { isPersona, type Persona } from "./persona";

export const PERSONA_COOKIE_NAMES = {
  e2e: "crabit-e2e-persona",
  demo: "crabit-demo-persona",
} as const satisfies Readonly<Record<PersonaNamespace, string>>;

export function readPersonaCookie(
  headers: Headers,
  namespace: PersonaNamespace,
): Persona | null {
  const cookieHeader = headers.get("cookie");
  if (cookieHeader === null) {
    return null;
  }

  const cookieName = PERSONA_COOKIE_NAMES[namespace];
  const matchingValues: string[] = [];
  for (const rawPart of cookieHeader.split(";")) {
    const part = rawPart.trimStart();
    const separator = part.indexOf("=");
    if (separator < 0 || part.slice(0, separator) !== cookieName) {
      continue;
    }
    matchingValues.push(part.slice(separator + 1));
  }

  if (matchingValues.length !== 1) {
    return null;
  }

  return isPersona(matchingValues[0]) ? matchingValues[0] : null;
}

export function serializePersonaCookie(
  namespace: PersonaNamespace,
  persona: Persona,
  appEnv: AppEnvironment,
  requestUrl: string,
) {
  return serializeCookie(namespace, persona, appEnv, requestUrl);
}

export function serializePersonaCookieDeletion(
  namespace: PersonaNamespace,
  appEnv: AppEnvironment,
  requestUrl: string,
) {
  return serializeCookie(namespace, "", appEnv, requestUrl, true);
}

function serializeCookie(
  namespace: PersonaNamespace,
  value: string,
  appEnv: AppEnvironment,
  requestUrl: string,
  deleting = false,
) {
  const attributes = [
    `${PERSONA_COOKIE_NAMES[namespace]}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (deleting) {
    attributes.push("Max-Age=0");
  }
  if (appEnv === "staging" || appEnv === "prod" || new URL(requestUrl).protocol === "https:") {
    attributes.push("Secure");
  }
  return attributes.join("; ");
}
