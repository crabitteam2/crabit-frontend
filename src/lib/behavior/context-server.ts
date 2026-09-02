import "server-only";
import { isJsonMediaType } from "../http/media-type";
import { createHash, randomUUID } from "node:crypto";
import type { BffEnvironment } from "../../config/env";
import { readPersonaCookie } from "../persona/cookies";
import { proxyBackendRequest, type ProxyDependencies } from "../bff/proxy";
import { readBffEnvironment } from "../../config/env";

export const CONTEXT_HEADER = "X-Crabit-Behavior-Context";
const LEGACY_EPOCH = "00000000-0000-0000-0000-000000000000";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function cookieValue(headers: Headers, name: string): string | null {
  const values = (headers.get("cookie") ?? "")
    .split(";")
    .map((x) => x.trim())
    .filter((x) => x.startsWith(`${name}=`))
    .map((x) => x.slice(name.length + 1));
  return values.length === 1 ? values[0] : null;
}
export function contextCookieNames(namespace: string) {
  return {
    persona: `crabit-${namespace}-epoch`,
    academy: `crabit-${namespace}-academy-context`,
  };
}
export function behaviorCookie(
  name: string,
  value: string,
  environment: BffEnvironment,
  url: string,
) {
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax${environment.appEnv === "staging" || environment.appEnv === "prod" || new URL(url).protocol === "https:" ? "; Secure" : ""}${value === "" ? "; Max-Age=0" : ""}`;
}
export function currentContext(
  headers: Headers,
  environment: BffEnvironment,
  academyId: string,
): string | null {
  const namespace = environment.profilePolicy.credentialNamespace;
  if (!namespace) return null;
  const persona = readPersonaCookie(headers, namespace);
  const names = contextCookieNames(namespace);
  const rawEpoch = cookieValue(headers, names.persona);
  if (
    rawEpoch === null &&
    (headers.get("cookie") ?? "")
      .split(";")
      .some((part) => part.trim().startsWith(`${names.persona}=`))
  )
    return null;
  const epoch = rawEpoch ?? LEGACY_EPOCH;
  const selection = cookieValue(headers, names.academy);
  if (!persona || !epoch || !UUID.test(epoch) || !selection) return null;
  const [selectedEpoch, academy, selectionEpoch, extra] = selection.split(".");
  if (
    selectedEpoch !== epoch ||
    academy !== academyId ||
    !UUID.test(academy) ||
    !UUID.test(selectionEpoch ?? "") ||
    extra !== undefined
  )
    return null;
  return createHash("sha256")
    .update(
      JSON.stringify([namespace, persona, epoch, academy, selectionEpoch]),
    )
    .digest("hex");
}
export function contextError(status: number, code: string) {
  return Response.json(
    {
      code,
      message:
        code === "BEHAVIOR_CONTEXT_MISMATCH"
          ? "Collection context is no longer current"
          : "Collection context is unavailable",
    },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
export async function handleBehaviorContext(
  request: Request,
  dependencies: ProxyDependencies = {},
) {
  let environment: BffEnvironment;
  try {
    environment = (dependencies.loadEnvironment ?? readBffEnvironment)();
  } catch {
    return contextError(500, "BFF_CONFIGURATION_ERROR");
  }
  const namespace = environment.profilePolicy.credentialNamespace;
  if (!namespace || !readPersonaCookie(request.headers, namespace))
    return contextError(401, "BEHAVIOR_AUTH_REQUIRED");
  if (!isJsonMediaType(request.headers.get("content-type")))
    return contextError(400, "BEHAVIOR_CONTEXT_INVALID");
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return contextError(400, "BEHAVIOR_CONTEXT_INVALID");
  }
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).length !== 1 ||
    !("academyId" in body) ||
    typeof body.academyId !== "string" ||
    !UUID.test(body.academyId)
  )
    return contextError(400, "BEHAVIOR_CONTEXT_INVALID");
  const accountResponse = await proxyBackendRequest(
    new Request(
      new URL("/api/backend/v1/me/card-balance-accounts", request.url),
      { headers: request.headers },
    ),
    ["v1", "me", "card-balance-accounts"],
    dependencies,
  );
  if (!accountResponse.ok)
    return contextError(
      accountResponse.status === 401 ? 401 : 502,
      "BFF_UPSTREAM_UNAVAILABLE",
    );
  const accounts = await accountResponse.json();
  if (
    !accounts.items?.some(
      (account: { academyId: string }) => account.academyId === body.academyId,
    )
  )
    return contextError(403, "BEHAVIOR_ACADEMY_UNAVAILABLE");
  const names = contextCookieNames(namespace);
  const existingEpoch = cookieValue(request.headers, names.persona);
  if (existingEpoch !== null && !UUID.test(existingEpoch))
    return contextError(409, "BEHAVIOR_CONTEXT_MISMATCH");
  const epoch = existingEpoch ?? LEGACY_EPOCH;
  const headers = new Headers(request.headers);
  let contextId = currentContext(headers, environment, body.academyId);
  const responseHeaders = new Headers({ "Cache-Control": "no-store" });
  if (!contextId) {
    const selection = `${epoch}.${body.academyId}.${randomUUID()}`;
    const cookies = (headers.get("cookie") ?? "")
      .split(";")
      .filter(
        (x) =>
          !x.trim().startsWith(`${names.persona}=`) &&
          !x.trim().startsWith(`${names.academy}=`),
      );
    headers.set(
      "cookie",
      [
        ...cookies,
        `${names.persona}=${epoch}`,
        `${names.academy}=${selection}`,
      ].join("; "),
    );
    responseHeaders.append(
      "Set-Cookie",
      behaviorCookie(names.academy, selection, environment, request.url),
    );
    contextId = currentContext(headers, environment, body.academyId);
  }
  return Response.json(
    { contextId, academyId: body.academyId },
    { headers: responseHeaders },
  );
}
