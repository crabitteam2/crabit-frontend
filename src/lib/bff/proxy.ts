import "server-only";

import {
  readBffEnvironment,
  type BffEnvironment,
} from "../../config/env";
import {
  readPersonaTokenConfiguration,
  type PersonaTokenConfiguration,
} from "../../config/persona-tokens";
import { readPersonaCookie } from "../persona/cookies";

const FORWARDED_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);
const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const REQUEST_HEADER_ALLOWLIST = [
  "accept",
  "accept-language",
  "content-type",
  "idempotency-key",
  "if-match",
] as const;
const RESPONSE_HEADER_ALLOWLIST = [
  "content-type",
  "www-authenticate",
  "idempotency-replayed",
] as const;
const METHOD_ALLOW_HEADER = "GET, POST, PUT, PATCH, DELETE";
const UPSTREAM_TIMEOUT_MILLISECONDS = 10_000;

export interface ProxyDependencies {
  readonly fetchImpl?: typeof globalThis.fetch;
  readonly loadEnvironment?: () => BffEnvironment;
  readonly loadTokens?: (environment: BffEnvironment) => PersonaTokenConfiguration;
  readonly timeoutMilliseconds?: number;
}

export async function proxyBackendRequest(
  request: Request,
  pathSegments: readonly string[],
  dependencies: ProxyDependencies = {},
): Promise<Response> {
  if (!FORWARDED_METHODS.has(request.method)) {
    return methodNotAllowedResponse();
  }

  let environment: BffEnvironment;
  let tokenConfiguration: PersonaTokenConfiguration;
  try {
    environment = (dependencies.loadEnvironment ?? readBffEnvironment)();
    tokenConfiguration = (dependencies.loadTokens ?? defaultLoadTokens)(environment);
  } catch {
    return errorResponse(
      500,
      "BFF_CONFIGURATION_ERROR",
      "BFF configuration is invalid",
    );
  }

  const target = constructTarget(request.url, pathSegments, environment);
  if (target === null) {
    return invalidRequestResponse();
  }

  if (pathSegments[0] === "e2e" && !environment.profilePolicy.allowsE2eUpstream) {
    return errorResponse(404, "BFF_NOT_FOUND", "BFF route is not found");
  }

  let body: ArrayBuffer | undefined;
  if (METHODS_WITH_BODY.has(request.method)) {
    try {
      body = await request.arrayBuffer();
    } catch {
      return invalidRequestResponse();
    }
  }

  const fetchImpl = dependencies.fetchImpl ?? globalThis.fetch;
  const abortController = new AbortController();
  const timeout = setTimeout(
    () => abortController.abort(),
    dependencies.timeoutMilliseconds ?? UPSTREAM_TIMEOUT_MILLISECONDS,
  );

  let upstreamResponse: Response;
  let upstreamBody: ArrayBuffer;
  try {
    const headers = copyAllowedHeaders(request.headers, REQUEST_HEADER_ALLOWLIST);
    injectServerCredential(headers, request.headers, environment, tokenConfiguration);
    upstreamResponse = await fetchImpl(target, {
      method: request.method,
      headers,
      ...(body === undefined ? {} : { body }),
      cache: "no-store",
      redirect: "manual",
      signal: abortController.signal,
    });
    upstreamBody = await upstreamResponse.arrayBuffer();
  } catch {
    return errorResponse(
      502,
      "BFF_UPSTREAM_UNAVAILABLE",
      "Backend service is unavailable",
    );
  } finally {
    clearTimeout(timeout);
  }

  const headers = copyAllowedHeaders(
    upstreamResponse.headers,
    RESPONSE_HEADER_ALLOWLIST,
  );
  headers.set("Cache-Control", "no-store");

  return new Response(statusForbidsBody(upstreamResponse.status) ? null : upstreamBody, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers,
  });
}

function defaultLoadTokens(environment: BffEnvironment) {
  return readPersonaTokenConfiguration(environment.backendProfile);
}

function injectServerCredential(
  upstreamHeaders: Headers,
  browserHeaders: Headers,
  environment: BffEnvironment,
  tokenConfiguration: PersonaTokenConfiguration,
) {
  const namespace = environment.profilePolicy.credentialNamespace;
  if (namespace === null || tokenConfiguration.active === null) {
    return;
  }

  const persona = readPersonaCookie(browserHeaders, namespace);
  if (persona === null) {
    return;
  }

  upstreamHeaders.set("Authorization", `Bearer ${tokenConfiguration.active[persona]}`);
}

export function methodNotAllowedResponse() {
  return errorResponse(
    405,
    "BFF_METHOD_NOT_ALLOWED",
    "HTTP method is not allowed",
    { Allow: METHOD_ALLOW_HEADER },
  );
}

function constructTarget(
  requestUrl: string,
  pathSegments: readonly string[],
  environment: BffEnvironment,
): URL | null {
  if (pathSegments.length === 0 || requestUrl.includes("#")) {
    return null;
  }

  const encodedSegments: string[] = [];
  try {
    for (const segment of pathSegments) {
      if (
        segment.length === 0
        || segment === "."
        || segment === ".."
        || segment.includes("\0")
        || segment.includes("\\")
        || segment.includes("/")
      ) {
        return null;
      }
      encodedSegments.push(encodeURIComponent(segment));
    }
  } catch {
    return null;
  }

  const queryStart = requestUrl.indexOf("?");
  const rawQuery = queryStart < 0 ? "" : requestUrl.slice(queryStart);
  const expectedPath = `/${encodedSegments.join("/")}`;

  let target: URL;
  try {
    target = new URL(`${expectedPath}${rawQuery}`, environment.backendUrl);
  } catch {
    return null;
  }

  if (
    target.origin !== environment.backendUrl.origin
    || target.pathname !== expectedPath
    || target.hash.length > 0
  ) {
    return null;
  }

  return target;
}

function copyAllowedHeaders(
  source: Headers,
  allowlist: readonly string[],
) {
  const connectionNominated = connectionNominatedHeaders(source);
  const copied = new Headers();

  for (const name of allowlist) {
    if (connectionNominated.has(name)) {
      continue;
    }

    const value = source.get(name);
    if (value !== null) {
      copied.set(name, value);
    }
  }

  return copied;
}

function connectionNominatedHeaders(headers: Headers) {
  const nominated = new Set<string>();
  for (const name of (headers.get("connection") ?? "").split(",")) {
    const normalized = name.trim().toLowerCase();
    if (normalized.length > 0) {
      nominated.add(normalized);
    }
  }
  return nominated;
}

function statusForbidsBody(status: number) {
  return status === 204 || status === 205 || status === 304;
}

function invalidRequestResponse() {
  return errorResponse(
    400,
    "BFF_INVALID_REQUEST",
    "BFF request is invalid",
  );
}

function errorResponse(
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
