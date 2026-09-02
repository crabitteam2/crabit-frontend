import type { components } from "./generated/crabit-backend";
import { isJsonMediaType } from "./media-type";

/** 프론트엔드가 분기할 수 있는 정규화 오류 출처입니다. */
export type FrontendErrorKind = "backend" | "bff" | "network" | "malformed";

/** 고정된 백엔드 오류 봉투가 허용하는 오류 코드입니다. */
export type BackendErrorCode = components["schemas"]["ErrorCode"];

/** 기능 코드에 노출되는 정규화된 HTTP 오류입니다. */
export interface FrontendHttpError {
  /** 오류가 발생하거나 정규화된 계층입니다. */
  readonly kind: FrontendErrorKind;
  /** 응답을 받은 경우의 HTTP 상태 코드입니다. */
  readonly status?: number;
  /** 백엔드·BFF·네트워크·응답 형식 오류를 구분하는 안정적인 코드입니다. */
  readonly code:
    BackendErrorCode | BffErrorCode | "NETWORK_ERROR" | "MALFORMED_RESPONSE";
  /** 사용자 흐름 또는 로그에 사용할 정규화 메시지입니다. */
  readonly message: string;
  /** 같은 작업을 다시 시도할 수 있는지 나타냅니다. */
  readonly retryable?: boolean;
  /** 백엔드 추적 식별자입니다. */
  readonly traceId?: string;
  /** 입력 필드별 백엔드 검증 오류입니다. */
  readonly fieldErrors?: readonly {
    readonly field: string;
    readonly message: string;
  }[];
  /** 백엔드가 제공한 추가 JSON 객체입니다. */
  readonly details?: Readonly<Record<string, unknown>>;
}

const BACKEND_ERROR_CODES = new Set<BackendErrorCode>([
  "SELF_PROFILE_VISIT",
  "EVENT_TIME_OUT_OF_RANGE",
  "PROFILE_NOT_FOUND",
  "FEED_CONTEXT_NOT_FOUND",
  "FEED_CONTEXT_EXPIRED",
  "EVENT_ID_CONFLICT",
  "IMPRESSION_CONFLICT",
  "IMPRESSION_ALREADY_EXPOSED",
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
  "INVALID_DATE_RANGE",
  "INVALID_VERSION",
  "BALANCE_SYNC_FAILED",
  "STUDENT_NOT_FOUND",
  "STUDENT_BLOCK_NOT_FOUND",
  "SELF_RELATIONSHIP",
  "STUDENT_BLOCK_ALREADY_ACTIVE",
  "WISH_PHOTO_NOT_FOUND",
  "WISH_PHOTO_EXPIRED",
  "WISH_PHOTO_ALREADY_ATTACHED",
  "PHOTO_TOO_LARGE",
  "UNSUPPORTED_PHOTO_TYPE",
  "INVALID_PHOTO",
  "PHOTO_CONTENT_NOT_ALLOWED",
  "PHOTO_UPLOAD_RATE_LIMITED",
  "PHOTO_PROCESSING_UNAVAILABLE",
  "PHOTO_DELIVERY_UNAVAILABLE",
]);

const BFF_ERROR_CODES = [
  "BFF_INVALID_REQUEST",
  "BFF_METHOD_NOT_ALLOWED",
  "BFF_CONFIGURATION_ERROR",
  "BFF_UPSTREAM_UNAVAILABLE",
  "BFF_NOT_FOUND",
  "BFF_REQUEST_TIMEOUT",
  "BFF_PAYLOAD_TOO_LARGE",
  "PERSONA_INVALID",
  "PERSONA_UNAVAILABLE",
  "PERSONA_METHOD_NOT_ALLOWED",
  "PERSONA_CONFIGURATION_ERROR",
] as const;

/** BFF와 persona Route Handler가 반환할 수 있는 오류 코드입니다. */
export type BffErrorCode = (typeof BFF_ERROR_CODES)[number];
const BFF_ERROR_CODE_SET = new Set<string>(BFF_ERROR_CODES);

/**
 * HTTP 오류 응답을 백엔드 또는 BFF 오류 봉투로 엄격히 검증해 정규화합니다.
 * JSON 미디어 타입, 키 집합 또는 필드 타입이 다르면 malformed 오류를 반환합니다.
 */
export async function normalizeErrorResponse(
  response: Response,
): Promise<FrontendHttpError> {
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

/** 전송 단계 예외를 재시도 가능한 네트워크 오류로 정규화합니다. */
export function normalizeNetworkFailure(): FrontendHttpError {
  return {
    kind: "network",
    code: "NETWORK_ERROR",
    message: "Backend request failed",
    retryable: true,
  };
}

function normalizeBackendEnvelope(
  value: unknown,
  status: number,
): FrontendHttpError | null {
  if (!hasExactKeys(value, ["error"])) {
    return null;
  }
  const error = value.error;
  if (
    !hasExactKeys(error, [
      "code",
      "details",
      "fieldErrors",
      "message",
      "retryable",
      "traceId",
    ])
  ) {
    return null;
  }
  if (
    typeof error.code !== "string" ||
    !BACKEND_ERROR_CODES.has(error.code as BackendErrorCode) ||
    !isNonemptyString(error.message) ||
    typeof error.retryable !== "boolean" ||
    !isNonemptyString(error.traceId) ||
    !isFieldErrors(error.fieldErrors) ||
    !isJsonObject(error.details)
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

function normalizeBffEnvelope(
  value: unknown,
  status: number,
): FrontendHttpError | null {
  if (
    !hasExactKeys(value, ["code", "message"]) ||
    typeof value.code !== "string" ||
    !BFF_ERROR_CODE_SET.has(value.code) ||
    !isNonemptyString(value.message)
  ) {
    return null;
  }
  return {
    kind: "bff",
    status,
    code: value.code as BffErrorCode,
    message: value.message,
    ...bffRetryability(value.code as BffErrorCode),
  };
}

function bffRetryability(
  code: BffErrorCode,
): Pick<FrontendHttpError, "retryable"> | Record<string, never> {
  switch (code) {
    case "BFF_REQUEST_TIMEOUT":
      return { retryable: true };
    case "BFF_PAYLOAD_TOO_LARGE":
      return { retryable: false };
    default:
      return {};
  }
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
  return (
    isJsonObject(value) &&
    JSON.stringify(Object.keys(value).sort()) ===
      JSON.stringify([...keys].sort())
  );
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
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        hasExactKeys(item, ["field", "message"]) &&
        isNonemptyString(item.field) &&
        isNonemptyString(item.message),
    )
  );
}
