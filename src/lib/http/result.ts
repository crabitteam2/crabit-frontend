import type { FrontendHttpError } from "./errors";
import { normalizeErrorResponse, normalizeNetworkFailure } from "./errors";

/** 성공 데이터와 정규화된 프론트엔드 HTTP 오류를 구분하는 결과 타입입니다. */
export type ApiResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: FrontendHttpError };

interface OpenApiResponse {
  readonly data?: unknown;
  readonly error?: unknown;
  readonly response: Response;
}

/**
 * openapi-fetch 응답을 기능 코드가 공통으로 처리할 수 있는 {@link ApiResult}로 변환합니다.
 * 전송 예외는 네트워크 오류로, 비정상 오류 본문은 malformed 오류로 정규화합니다.
 */
export async function apiResult<T>(
  request: () => Promise<OpenApiResponse>,
): Promise<ApiResult<T>> {
  try {
    const result = await request();
    if (result.response.ok) {
      return { ok: true, data: result.data as T };
    }

    // openapi-fetch consumes the response body before returning. Recreate only
    // the parsed value and then apply the single strict envelope validator.
    const response = new Response(JSON.stringify(result.error), {
      status: result.response.status,
      headers: {
        "Content-Type": result.response.headers.get("content-type") ?? "",
      },
    });
    return { ok: false, error: await normalizeErrorResponse(response) };
  } catch {
    return { ok: false, error: normalizeNetworkFailure() };
  }
}

/** 실패한 {@link ApiResult}를 예외 흐름으로 전환할 때 사용하는 안전한 오류입니다. */
export class FrontendRequestError extends Error {
  /** 원본 예외 대신 노출되는 정규화된 HTTP 오류입니다. */
  readonly httpError: FrontendHttpError;

  constructor(httpError: FrontendHttpError) {
    super(httpError.message);
    this.name = "FrontendRequestError";
    this.httpError = httpError;
  }
}

/** 성공 데이터를 반환하고 실패 결과는 {@link FrontendRequestError}로 던집니다. */
export function unwrapResult<T>(result: ApiResult<T>): T {
  if (result.ok) {
    return result.data;
  }
  throw new FrontendRequestError(result.error);
}
