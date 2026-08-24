import "server-only";

import createClient from "openapi-fetch";
import {
  readBffEnvironment,
  type BffEnvironment,
} from "../../config/env";
import {
  readPersonaTokenConfiguration,
  type PersonaTokenConfiguration,
} from "../../config/persona-tokens";
import { readPersonaCookie } from "../persona/cookies";
import { isPersona, type Persona } from "../persona/persona";
import type { paths } from "./generated/crabit-backend";

export type ServerRequestContext =
  | { readonly persona?: Persona | null; readonly request?: never }
  | { readonly request: Pick<Request, "headers">; readonly persona?: never };

export interface ServerClientDependencies {
  readonly fetch?: (input: Request) => Promise<Response>;
  readonly loadEnvironment?: () => BffEnvironment;
  readonly loadTokens?: (environment: BffEnvironment) => PersonaTokenConfiguration;
}

export function createServerApiClient(
  context: ServerRequestContext = {},
  dependencies: ServerClientDependencies = {},
) {
  const environment = (dependencies.loadEnvironment ?? readBffEnvironment)();
  const tokens = (dependencies.loadTokens ?? defaultLoadTokens)(environment);
  const persona = resolvePersona(context, environment);
  const token = persona === null || tokens.active === null
    ? null
    : tokens.active[persona];

  return createClient<paths>({
    baseUrl: environment.backendUrl.href,
    cache: "no-store",
    fetch: dependencies.fetch,
    headers: token === null ? undefined : { Authorization: `Bearer ${token}` },
  });
}

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
    return namespace === null ? null : readPersonaCookie(context.request.headers, namespace);
  }
  return isPersona(context.persona) ? context.persona : null;
}
