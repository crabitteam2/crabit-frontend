import { handleBehaviorContext } from "@/lib/behavior/context-server";
export function POST(request: Request) {
  return handleBehaviorContext(request);
}
