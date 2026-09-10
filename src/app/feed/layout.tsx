import type { ReactNode } from "react";
import { BehaviorSession } from "./_components/behavior-session";
export default function FeedLayout({ children }: { children: ReactNode }) {
  return <BehaviorSession>{children}</BehaviorSession>;
}
