import type { components } from "./generated/crabit-backend";
import { isJsonMediaType } from "./media-type";

export type FrontendErrorKind = "backend" | "bff" | "network" | "malformed";
export type BackendErrorCode = components["schemas"]["ErrorCode"];

export interface FrontendHttpError {
  readonly kind: FrontendErrorKind;
  readonly status?: number;
  readonly code: BackendErrorCode | BffErrorCode | "NETWORK_ERROR" | "MALFORMED_RESPONSE";
  readonly message: string;
  readonly retryable?: boolean;
  readonly traceId?: string;
  readonly fieldErrors?: readonly { readonly field: string; readonly message: string }[];
  readonly details?: Readonly<Record<string, unknown>>;
}

const BACKEND_ERROR_CODES = new Set<BackendErrorCode>([
  "MALFORMED_REQUEST",
  "EXPECTED_VERSION_REQUIRED",
  "IDEMPOTENCY_KEY_REQUIRED",
  "AUTH_REQUIRED",
  "FORBIDDEN",
  "CARD_BALANCE_ACCOUNT_NOT_FOUND",
  "WISH_NOT_FOUND",
  "ACADEMY_NOT_FOUND",
  "SHARED_CARD_NOT_FOUND",
  "VERSION_CONFLICT",
  "INVALID_STATE_TRANSITION",
  "BALANCE_MISMATCH_LOCKED",
  "INSUFFICIENT_AVAILABLE_BALANCE",
  "INSUFFICIENT_WISH_AMOUNT",
  "TARGET_AMOUNT_EXCEEDED",
  "CROSS_ACCOUNT_TRANSFER_FORBIDDEN",
  "IDEMPOTENCY_KEY_REUSED",
  "UNSUPPORTED_MEDIA_TYPE",
  "INVALID_AMOUNT",
  "INVALID_PURPOSE",
  "INVALID_VERSION",
  "BALANCE_SYNC_FAILED",
]);

const BFF_ERROR_CODES = [
  "BFF_INVALID_REQUEST",
  "BFF_METHOD_NOT_ALLOWED",
  "BFF_CONFIGURATION_ERROR",
  "BFF_UPSTREAM_UNAVAILABLE",
  "BFF_NOT_FOUND",
  "PERSONA_INVALID",
  "PERSONA_UNAVAILABLE",
  "PERSONA_METHOD_NOT_ALLOWED",
  "PERSONA_CONFIGURATION_ERROR",
] as const;

export type BffErrorCode = (typeof BFF_ERROR_CODES)[number];
const BFF_ERROR_CODE_SET = new Set<string>(BFF_ERROR_CODES);

export async function normalizeErrorResponse(response: Response): Promise<FrontendHttpError> {
  if (!isJsonMediaType(response.headers.get("content-type"))) {
    return malformedError(response.status);
  }

  let value: unknown;
  try {
    value = await response.clone().json();
  } catch {
    return malformedError(response.status);
  }

  const backend = normalizeBackendEnvelope(value, response.status);
  if (backend !== null) {
    return backend;
  }

  const bff = normalizeBffEnvelope(value, response.status);
  return bff ?? malformedError(response.status);
}

export function normalizeNetworkFailure(): FrontendHttpError {
  return {
    kind: "network",
    code: "NETWORK_ERROR",
    message: "Backend request failed",
    retryable: true,
  };
}

function normalizeBackendEnvelope(value: unknown, status: number): FrontendHttpError | null {
  if (!hasExactKeys(value, ["error"])) {
    return null;
  }
  const error = value.error;
  if (!hasExactKeys(error, [
    "code",
    "details",
    "fieldErrors",
    "message",
    "retryable",
    "traceId",
  ])) {
    return null;
  }
  if (
    typeof error.code !== "string"
    || !BACKEND_ERROR_CODES.has(error.code as BackendErrorCode)
    || !isNonemptyString(error.message)
    || typeof error.retryable !== "boolean"
    || !isNonemptyString(error.traceId)
    || !isFieldErrors(error.fieldErrors)
    || !isJsonObject(error.details)
  ) {
    return null;
  }

  return {
    kind: "backend",
    status,
    code: error.code as BackendErrorCode,
    message: error.message,
    retryable: error.retryable,
    traceId: error.traceId,
    fieldErrors: error.fieldErrors,
    details: error.details,
  };
}

function normalizeBffEnvelope(value: unknown, status: number): FrontendHttpError | null {
  if (
    !hasExactKeys(value, ["code", "message"])
    || typeof value.code !== "string"
    || !BFF_ERROR_CODE_SET.has(value.code)
    || !isNonemptyString(value.message)
  ) {
    return null;
  }
  return {
    kind: "bff",
    status,
    code: value.code as BffErrorCode,
    message: value.message,
  };
}

function malformedError(status?: number): FrontendHttpError {
  return {
    kind: "malformed",
    ...(status === undefined ? {} : { status }),
    code: "MALFORMED_RESPONSE",
    message: "Backend response is invalid",
    retryable: false,
  };
}

function hasExactKeys(
  value: unknown,
  keys: readonly string[],
): value is Record<string, unknown> {
  return isJsonObject(value)
    && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort());
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonemptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isFieldErrors(
  value: unknown,
): value is { readonly field: string; readonly message: string }[] {
  return Array.isArray(value) && value.every((item) => (
    hasExactKeys(item, ["field", "message"])
    && isNonemptyString(item.field)
    && isNonemptyString(item.message)
  ));
}
