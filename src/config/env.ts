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

export interface BffEnvironment {
  readonly appEnv: AppEnvironment;
  readonly backendProfile: BackendProfile;
  readonly backendUrl: URL;
  readonly profilePolicy: ProfilePolicy;
}

export class BffConfigurationError extends Error {
  constructor() {
    super("BFF configuration is invalid");
    this.name = "BffConfigurationError";
  }
}

export function readBffEnvironment(
  values: Readonly<Record<string, string | undefined>> = process.env,
): BffEnvironment {
  let profilePolicy: ProfilePolicy;
  try {
    profilePolicy = resolveProfilePolicy(values.APP_ENV, values.BACKEND_PROFILE);
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
    value === undefined
    || value.length === 0
    || /\s/.test(value)
    || value.includes("?")
    || value.includes("#")
    || hasAuthorityCredentials(value)
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
    (url.protocol !== "http:" && url.protocol !== "https:")
    || url.hostname.length === 0
    || url.username.length > 0
    || url.password.length > 0
    || url.pathname !== "/"
    || url.search.length > 0
    || url.hash.length > 0
    || ((appEnv === "staging" || appEnv === "prod")
      && url.protocol !== "https:")
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
  const authorityEnd = authorityEndCandidate < 0
    ? value.length
    : authorityStart + authorityEndCandidate;

  return value.slice(authorityStart, authorityEnd).includes("@");
}
