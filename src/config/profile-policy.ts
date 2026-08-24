/** 프론트엔드가 구분하는 실행 환경 목록입니다. */
export const APP_ENVIRONMENTS = ["local", "e2e", "staging", "prod"] as const;

/** 연결 대상과 서버 자격 증명 정책을 선택하는 백엔드 프로필 목록입니다. */
export const BACKEND_PROFILES = ["e2e", "demo", "prod"] as const;

/** 검증 가능한 프론트엔드 실행 환경입니다. */
export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];

/** 검증 가능한 백엔드 연결 프로필입니다. */
export type BackendProfile = (typeof BACKEND_PROFILES)[number];

/** persona 자격 증명을 가질 수 있는 비운영 프로필입니다. */
export type PersonaNamespace = Exclude<BackendProfile, "prod">;

/** 실행 환경과 백엔드 프로필 조합에서 파생된 서버 정책입니다. */
export interface ProfilePolicy {
  /** 현재 프론트엔드 실행 환경입니다. */
  readonly appEnv: AppEnvironment;
  /** 현재 백엔드 연결 프로필입니다. */
  readonly backendProfile: BackendProfile;
  /** persona 토큰을 조회할 서버 전용 네임스페이스입니다. */
  readonly credentialNamespace: PersonaNamespace | null;
  /** 브라우저가 보관할 HttpOnly persona 쿠키 이름입니다. */
  readonly personaCookieName:
    "crabit-e2e-persona" | "crabit-demo-persona" | null;
  /** persona를 선택하거나 해제하는 같은 출처 Route Handler 경로입니다. */
  readonly personaRoute: "/api/e2e/persona" | "/api/demo/persona" | null;
  /** `/e2e` 업스트림 경로를 전달할 수 있는지 여부입니다. */
  readonly allowsE2eUpstream: boolean;
}

const ALLOWED_BACKEND_PROFILES: Readonly<
  Record<AppEnvironment, readonly BackendProfile[]>
> = {
  local: ["e2e", "demo", "prod"],
  e2e: ["e2e"],
  staging: ["e2e"],
  prod: ["demo"],
};

/** 허용되지 않은 실행 환경과 백엔드 프로필 조합을 나타냅니다. */
export class ProfilePolicyError extends Error {
  constructor() {
    super("Frontend profile policy is invalid");
    this.name = "ProfilePolicyError";
  }
}

/**
 * 원시 환경 변수 값을 검증하고 서버에서 사용할 프로필 정책으로 변환합니다.
 *
 * local은 모든 프로필을 허용하고, e2e와 staging은 e2e만, prod는 demo만 허용합니다.
 *
 * @throws {@link ProfilePolicyError} 값이 알려진 이름이 아니거나 허용 조합이 아닐 때 발생합니다.
 */
export function resolveProfilePolicy(
  appEnvValue: string | undefined,
  backendProfileValue: string | undefined,
): ProfilePolicy {
  if (
    !isAppEnvironment(appEnvValue) ||
    !isBackendProfile(backendProfileValue)
  ) {
    throw new ProfilePolicyError();
  }

  if (!ALLOWED_BACKEND_PROFILES[appEnvValue].includes(backendProfileValue)) {
    throw new ProfilePolicyError();
  }

  if (backendProfileValue === "e2e") {
    return {
      appEnv: appEnvValue,
      backendProfile: backendProfileValue,
      credentialNamespace: "e2e",
      personaCookieName: "crabit-e2e-persona",
      personaRoute: "/api/e2e/persona",
      allowsE2eUpstream: true,
    };
  }

  if (backendProfileValue === "demo") {
    return {
      appEnv: appEnvValue,
      backendProfile: backendProfileValue,
      credentialNamespace: "demo",
      personaCookieName: "crabit-demo-persona",
      personaRoute: "/api/demo/persona",
      allowsE2eUpstream: false,
    };
  }

  return {
    appEnv: appEnvValue,
    backendProfile: backendProfileValue,
    credentialNamespace: null,
    personaCookieName: null,
    personaRoute: null,
    allowsE2eUpstream: false,
  };
}

function isAppEnvironment(value: string | undefined): value is AppEnvironment {
  return APP_ENVIRONMENTS.some((candidate) => candidate === value);
}

function isBackendProfile(value: string | undefined): value is BackendProfile {
  return BACKEND_PROFILES.some((candidate) => candidate === value);
}
