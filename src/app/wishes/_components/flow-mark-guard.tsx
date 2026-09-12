"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { hasFlowMark } from "./fund-ticket";

interface FlowMarkGuardProps {
  /** 앞 화면이 남긴 표를 찾을 이름입니다. */
  name: string;
  /** 표가 없을 때 되돌아갈 경로입니다. */
  fallbackHref: string;
  children: ReactNode;
}

/** 앞 화면을 거쳐 들어왔을 때만 결과 화면을 보여줍니다. */
export function FlowMarkGuard({
  name,
  fallbackHref,
  children,
}: FlowMarkGuardProps) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (hasFlowMark(name)) {
      setIsAllowed(true);
      return;
    }
    router.replace(fallbackHref);
  }, [fallbackHref, name, router]);

  return isAllowed ? children : null;
}
