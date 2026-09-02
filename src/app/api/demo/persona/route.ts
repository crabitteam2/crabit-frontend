import { handlePersonaRoute } from "../../../../lib/persona/route";

export const runtime = "nodejs";

function handle(request: Request) {
  return handlePersonaRoute(request, "demo");
}

export {
  handle as DELETE,
  handle as GET,
  handle as HEAD,
  handle as OPTIONS,
  handle as PATCH,
  handle as POST,
  handle as PUT,
};
