"use client";

import createClient from "openapi-fetch";
import type { paths } from "./generated/crabit-backend";

/** 브라우저 요청이 사용하는 같은 출처 BFF 루트 경로입니다. */
export const BROWSER_API_BASE_URL = "/api/backend";

/** 브라우저용 OpenAPI 클라이언트의 테스트 가능 경계입니다. */
export interface BrowserClientDependencies {
  /** 요청 전송에 사용할 fetch 구현입니다. */
  readonly fetch?: (input: Request) => Promise<Response>;
  /** openapi-fetch가 요청을 만들 때 사용할 Request 생성자입니다. */
  readonly Request?: typeof globalThis.Request;
}

/**
 * 브라우저에서 같은 출처 BFF만 호출하는 타입 안전 OpenAPI 클라이언트를 생성합니다.
 * 서버 URL이나 Authorization 헤더를 브라우저 코드에 전달하지 않습니다.
 */
export function createBrowserApiClient(
  dependencies: BrowserClientDependencies = {},
) {
  return createClient<paths>({
    baseUrl: BROWSER_API_BASE_URL,
    credentials: "same-origin",
    fetch: dependencies.fetch,
    Request: dependencies.Request,
  });
}

/** 브라우저용 Crabit OpenAPI 클라이언트 타입입니다. */
export type BrowserApiClient = ReturnType<typeof createBrowserApiClient>;
