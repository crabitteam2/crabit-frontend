import "server-only";
import { randomUUID } from "node:crypto";
import { behaviorCookie, contextCookieNames } from "../behavior/context-server";

import { readBffEnvironment, type BffEnvironment } from "../../config/env";
import {
  readPersonaTokenConfiguration,
  type PersonaTokenConfiguration,
} from "../../config/persona-tokens";
import type { PersonaNamespace } from "../../config/profile-policy";
import { isJsonMediaType } from "../http/media-type";
import {
  serializePersonaCookie,
  serializePersonaCookieDeletion,
} from "./cookies";
import { isPersona } from "./persona";

const ALLOW = "POST, DELETE";

/** persona Route Handler의 서버 경계를 테스트 가능하게 주입하는 선택 의존성입니다. */
export interface PersonaRouteDependencies {
  /** 검증된 BFF 환경을 읽는 함수입니다. */
  readonly loadEnvironment?: () => BffEnvironment;
  /** 프로필별 서버 자격 증명을 읽는 함수입니다. */
  readonly loadTokens?: (
    environment: BffEnvironment,
  ) => PersonaTokenConfiguration;
}

/**
 * e2e 또는 demo persona 선택 Route Handler의 공통 동작을 처리합니다.
 *
 * 활성 프로필과 정확히 일치하는 네임스페이스만 허용합니다. POST는 엄격한 JSON 본문을
 * 검증해 쿠키를 설정하고 DELETE는 쿠키를 만료시키며, 성공 시 본문 없는 204를 반환합니다.
 * 모든 응답은 캐시되지 않습니다.
 */
export async function handlePersonaRoute(
  request: Request,
  namespace: PersonaNamespace,
  dependencies: PersonaRouteDependencies = {},
): Promise<Response> {
  let environment: BffEnvironment;
  try {
    environment = (dependencies.loadEnvironment ?? readBffEnvironment)();
  } catch {
    return personaError(
      500,
      "PERSONA_CONFIGURATION_ERROR",
      "Persona configuration is invalid",
    );
  }

  if (environment.profilePolicy.credentialNamespace !== namespace) {
    return personaError(
      404,
      "PERSONA_UNAVAILABLE",
      "Persona route is unavailable",
    );
  }

  if (request.method !== "POST" && request.method !== "DELETE") {
    return personaError(
      405,
      "PERSONA_METHOD_NOT_ALLOWED",
      "HTTP method is not allowed",
      { Allow: ALLOW },
    );
  }

  try {
    (dependencies.loadTokens ?? defaultLoadTokens)(environment);
  } catch {
    return personaError(
      500,
      "PERSONA_CONFIGURATION_ERROR",
      "Persona configuration is invalid",
    );
  }

  if (request.method === "DELETE") {
    return personaSuccess(
      serializePersonaCookieDeletion(
        namespace,
        environment.appEnv,
        request.url,
      ),
      namespace, environment, request.url, true,
    );
  }

  if (!isJsonMediaType(request.headers.get("content-type"))) {
    return personaError(400, "PERSONA_INVALID", "Persona selection is invalid");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return personaError(400, "PERSONA_INVALID", "Persona selection is invalid");
  }

  if (!isPersonaSelection(body)) {
    return personaError(400, "PERSONA_INVALID", "Persona selection is invalid");
  }

  return personaSuccess(
    serializePersonaCookie(
      namespace,
      body.persona,
      environment.appEnv,
      request.url,
    ),
    namespace, environment, request.url, false,
  );
}

function defaultLoadTokens(environment: BffEnvironment) {
  return readPersonaTokenConfiguration(environment.backendProfile);
}

function isPersonaSelection(
  value: unknown,
): value is { readonly persona: import("./persona").Persona } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return Object.keys(record).length === 1 && isPersona(record.persona);
}

function personaSuccess(setCookie: string, namespace: PersonaNamespace, environment: BffEnvironment, url: string, deleting: boolean) {
  const headers = new Headers({ "Cache-Control": "no-store", "Set-Cookie": setCookie });
  const names = contextCookieNames(namespace);
  headers.append("Set-Cookie", behaviorCookie(names.persona, deleting ? "" : randomUUID(), environment, url));
  headers.append("Set-Cookie", behaviorCookie(names.academy, "", environment, url));
  return new Response(null, {
    status: 204,
    headers,
  });
}

function personaError(
  status: number,
  code: string,
  message: string,
  extraHeaders: HeadersInit = {},
) {
  return new Response(JSON.stringify({ code, message }), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
      ...Object.fromEntries(new Headers(extraHeaders)),
    },
  });
}
