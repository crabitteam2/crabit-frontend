import "server-only";

import createClient from "openapi-fetch";
import { readBffEnvironment, type BffEnvironment } from "../../config/env";
import {
  readPersonaTokenConfiguration,
  type PersonaTokenConfiguration,
} from "../../config/persona-tokens";
import { readPersonaCookie } from "../persona/cookies";
import { isPersona, type Persona } from "../persona/persona";
import type { paths } from "./generated/crabit-backend";

/**
 * 서버 요청의 persona를 직접 지정하거나 요청 쿠키에서 읽기 위한 상호 배타적 문맥입니다.
 */
export type ServerRequestContext =
  | { readonly persona?: Persona | null; readonly request?: never }
  | { readonly request: Pick<Request, "headers">; readonly persona?: never };

/** 서버용 OpenAPI 클라이언트의 테스트 가능 경계입니다. */
export interface ServerClientDependencies {
  /** 백엔드 요청 전송에 사용할 fetch 구현입니다. */
  readonly fetch?: (input: Request) => Promise<Response>;
  /** 검증된 BFF 환경을 읽는 함수입니다. */
  readonly loadEnvironment?: () => BffEnvironment;
  /** 프로필별 서버 자격 증명을 읽는 함수입니다. */
  readonly loadTokens?: (
    environment: BffEnvironment,
  ) => PersonaTokenConfiguration;
}

/**
 * 서버에서 백엔드를 직접 호출하는 타입 안전 OpenAPI 클라이언트를 생성합니다.
 *
 * 명시한 persona 또는 요청의 HttpOnly 쿠키를 현재 프로필의 토큰으로 변환해 Authorization
 * 헤더를 주입합니다. 토큰은 이 서버 전용 모듈 밖으로 반환되지 않으며 요청은 캐시되지 않습니다.
 */
export function createServerApiClient(
  context: ServerRequestContext = {},
  dependencies: ServerClientDependencies = {},
) {
  const environment = (dependencies.loadEnvironment ?? readBffEnvironment)();
  const tokens = (dependencies.loadTokens ?? defaultLoadTokens)(environment);
  const persona = resolvePersona(context, environment);
  const token =
    persona === null || tokens.active === null ? null : tokens.active[persona];

  return createClient<paths>({
    baseUrl: environment.backendUrl.href,
    cache: "no-store",
    fetch: dependencies.fetch,
    headers: token === null ? undefined : { Authorization: `Bearer ${token}` },
  });
}

/** 서버용 Crabit OpenAPI 클라이언트 타입입니다. */
export type ServerApiClient = ReturnType<typeof createServerApiClient>;

function defaultLoadTokens(environment: BffEnvironment) {
  return readPersonaTokenConfiguration(environment.backendProfile);
}

function resolvePersona(
  context: ServerRequestContext,
  environment: BffEnvironment,
): Persona | null {
  if ("request" in context && context.request !== undefined) {
    const namespace = environment.profilePolicy.credentialNamespace;
    return namespace === null
      ? null
      : readPersonaCookie(context.request.headers, namespace);
  }
  return isPersona(context.persona) ? context.persona : null;
}
