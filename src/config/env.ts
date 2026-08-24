import "server-only";

import {
  resolveProfilePolicy,
  type AppEnvironment,
  type BackendProfile,
  type ProfilePolicy,
} from "./profile-policy";

export {
  APP_ENVIRONMENTS,
  BACKEND_PROFILES,
  type AppEnvironment,
  type BackendProfile,
} from "./profile-policy";

/** 검증을 통과한 BFF 실행 환경입니다. */
export interface BffEnvironment {
  /** 검증된 실행 환경 이름입니다. */
  readonly appEnv: AppEnvironment;
  /** 자격 증명과 E2E 경계를 결정하는 백엔드 프로필입니다. */
  readonly backendProfile: BackendProfile;
  /** 자격 증명·경로·쿼리·프래그먼트가 없는 백엔드 루트 URL입니다. */
  readonly backendUrl: URL;
  /** 환경과 프로필 조합으로 확정된 서버 전용 정책입니다. */
  readonly profilePolicy: ProfilePolicy;
}

/** 설정 값이 공개 가능한 규칙을 위반했음을 나타내는 정규화 오류입니다. */
export class BffConfigurationError extends Error {
  constructor() {
    super("BFF configuration is invalid");
    this.name = "BffConfigurationError";
  }
}

/**
 * 대소문자를 구분하는 `APP_ENV`, `BACKEND_PROFILE`, `BACKEND_URL`을 읽고 검증합니다.
 * staging과 prod에서는 HTTPS 백엔드만 허용하며 환경과 프로필의 허용 조합을 함께 검사합니다.
 */
export function readBffEnvironment(
  values: Readonly<Record<string, string | undefined>> = process.env,
): BffEnvironment {
  let profilePolicy: ProfilePolicy;
  try {
    profilePolicy = resolveProfilePolicy(
      values.APP_ENV,
      values.BACKEND_PROFILE,
    );
  } catch {
    throw new BffConfigurationError();
  }

  const backendUrl = parseBackendUrl(values.BACKEND_URL, profilePolicy.appEnv);
  return {
    appEnv: profilePolicy.appEnv,
    backendProfile: profilePolicy.backendProfile,
    backendUrl,
    profilePolicy,
  };
}

function parseBackendUrl(
  value: string | undefined,
  appEnv: AppEnvironment,
): URL {
  if (
    value === undefined ||
    value.length === 0 ||
    /\s/.test(value) ||
    value.includes("?") ||
    value.includes("#") ||
    hasAuthorityCredentials(value)
  ) {
    throw new BffConfigurationError();
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new BffConfigurationError();
  }

  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    url.hostname.length === 0 ||
    url.username.length > 0 ||
    url.password.length > 0 ||
    url.pathname !== "/" ||
    url.search.length > 0 ||
    url.hash.length > 0 ||
    ((appEnv === "staging" || appEnv === "prod") && url.protocol !== "https:")
  ) {
    throw new BffConfigurationError();
  }

  return url;
}

function hasAuthorityCredentials(value: string) {
  const separator = value.indexOf("://");
  if (separator < 0) {
    return false;
  }

  const authorityStart = separator + 3;
  const authorityEndCandidate = value.slice(authorityStart).search(/[/?#]/);
  const authorityEnd =
    authorityEndCandidate < 0
      ? value.length
      : authorityStart + authorityEndCandidate;

  return value.slice(authorityStart, authorityEnd).includes("@");
}
