import type { FrontendHttpError } from "./errors";
import { normalizeErrorResponse, normalizeNetworkFailure } from "./errors";

export type ApiResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: FrontendHttpError };

interface OpenApiResponse {
  readonly data?: unknown;
  readonly error?: unknown;
  readonly response: Response;
}

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

export class FrontendRequestError extends Error {
  readonly httpError: FrontendHttpError;

  constructor(httpError: FrontendHttpError) {
    super(httpError.message);
    this.name = "FrontendRequestError";
    this.httpError = httpError;
  }
}

export function unwrapResult<T>(result: ApiResult<T>): T {
  if (result.ok) {
    return result.data;
  }
  throw new FrontendRequestError(result.error);
}
