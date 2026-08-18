import "server-only";

import {
  readBffEnvironment,
  type BffEnvironment,
} from "../../config/env";
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

export interface PersonaRouteDependencies {
  readonly loadEnvironment?: () => BffEnvironment;
  readonly loadTokens?: (environment: BffEnvironment) => PersonaTokenConfiguration;
}

export async function handlePersonaRoute(
  request: Request,
  namespace: PersonaNamespace,
  dependencies: PersonaRouteDependencies = {},
): Promise<Response> {
  let environment: BffEnvironment;
  try {
    environment = (dependencies.loadEnvironment ?? readBffEnvironment)();
  } catch {
    return personaError(500, "PERSONA_CONFIGURATION_ERROR", "Persona configuration is invalid");
  }

  if (environment.profilePolicy.credentialNamespace !== namespace) {
    return personaError(404, "PERSONA_UNAVAILABLE", "Persona route is unavailable");
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
    return personaError(500, "PERSONA_CONFIGURATION_ERROR", "Persona configuration is invalid");
  }

  if (request.method === "DELETE") {
    return personaSuccess(
      serializePersonaCookieDeletion(namespace, environment.appEnv, request.url),
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
    serializePersonaCookie(namespace, body.persona, environment.appEnv, request.url),
  );
}

function defaultLoadTokens(environment: BffEnvironment) {
  return readPersonaTokenConfiguration(environment.backendProfile);
}

function isPersonaSelection(value: unknown): value is { readonly persona: import("./persona").Persona } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return Object.keys(record).length === 1 && isPersona(record.persona);
}

function personaSuccess(setCookie: string) {
  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      "Set-Cookie": setCookie,
    },
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
