import {
  methodNotAllowedResponse,
  proxyBackendRequest,
} from "../../../../lib/bff/proxy";

export const runtime = "nodejs";

interface RouteContext {
  readonly params: Promise<{
    readonly path: string[];
  }>;
}

async function forward(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return proxyBackendRequest(request, path);
}

export {
  forward as DELETE,
  forward as GET,
  forward as PATCH,
  forward as POST,
  forward as PUT,
};

export function HEAD() {
  return methodNotAllowedResponse();
}

export function OPTIONS() {
  return methodNotAllowedResponse();
}
