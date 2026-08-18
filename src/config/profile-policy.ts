export const APP_ENVIRONMENTS = ["local", "e2e", "staging", "prod"] as const;
export const BACKEND_PROFILES = ["e2e", "demo", "prod"] as const;

export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];
export type BackendProfile = (typeof BACKEND_PROFILES)[number];
export type PersonaNamespace = Exclude<BackendProfile, "prod">;

export interface ProfilePolicy {
  readonly appEnv: AppEnvironment;
  readonly backendProfile: BackendProfile;
  readonly credentialNamespace: PersonaNamespace | null;
  readonly personaCookieName: "crabit-e2e-persona" | "crabit-demo-persona" | null;
  readonly personaRoute: "/api/e2e/persona" | "/api/demo/persona" | null;
  readonly allowsE2eUpstream: boolean;
}

const ALLOWED_BACKEND_PROFILES: Readonly<Record<AppEnvironment, readonly BackendProfile[]>> = {
  local: ["e2e", "demo", "prod"],
  e2e: ["e2e"],
  staging: ["e2e"],
  prod: ["demo"],
};

export class ProfilePolicyError extends Error {
  constructor() {
    super("Frontend profile policy is invalid");
    this.name = "ProfilePolicyError";
  }
}

export function resolveProfilePolicy(
  appEnvValue: string | undefined,
  backendProfileValue: string | undefined,
): ProfilePolicy {
  if (!isAppEnvironment(appEnvValue) || !isBackendProfile(backendProfileValue)) {
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
