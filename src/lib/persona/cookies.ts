import type {
  AppEnvironment,
  PersonaNamespace,
} from "../../config/profile-policy";
import { isPersona, type Persona } from "./persona";

/** 비운영 프로필별 HttpOnly persona 쿠키 이름입니다. */
export const PERSONA_COOKIE_NAMES = {
  e2e: "crabit-e2e-persona",
  demo: "crabit-demo-persona",
} as const satisfies Readonly<Record<PersonaNamespace, string>>;

/**
 * 요청 헤더에서 네임스페이스에 맞는 persona 쿠키를 읽습니다.
 *
 * 같은 이름의 쿠키가 중복되거나 값이 알려진 persona가 아니면 선택되지 않은 것으로 처리합니다.
 */
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

/**
 * persona 선택을 저장하는 `Set-Cookie` 값을 생성합니다.
 *
 * 쿠키는 Path=/, HttpOnly, SameSite=Lax를 사용하며 staging, prod 또는 HTTPS 요청에서는
 * Secure 속성도 추가합니다.
 */
export function serializePersonaCookie(
  namespace: PersonaNamespace,
  persona: Persona,
  appEnv: AppEnvironment,
  requestUrl: string,
) {
  return serializeCookie(namespace, persona, appEnv, requestUrl);
}

/** persona 선택을 즉시 만료시키는 `Set-Cookie` 값을 생성합니다. */
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
  if (
    appEnv === "staging" ||
    appEnv === "prod" ||
    new URL(requestUrl).protocol === "https:"
  ) {
    attributes.push("Secure");
  }
  return attributes.join("; ");
}
