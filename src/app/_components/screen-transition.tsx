"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { TAB_BAR_PATHS } from "./tab-bar";

const useBeforePaint =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const DURATION = 240;
/** 들어오는 화면이 미끄러지는 거리입니다. */
const SLIDE = 24;

/**
 * 탭을 옮길 때 새 화면이 옆에서 미끄러져 들어오게 합니다.
 *
 * 누른 탭이 오른쪽에 있으면 오른쪽에서, 왼쪽에 있으면 왼쪽에서 들어옵니다.
 * 탭이 아닌 화면 사이를 오갈 때는 아무것도 하지 않습니다.
 */
export function ScreenTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const screen = useRef<HTMLDivElement>(null);

  useBeforePaint(() => {
    const from = previous.current;
    previous.current = pathname;

    const fromIndex = TAB_BAR_PATHS.indexOf(from);
    const toIndex = TAB_BAR_PATHS.indexOf(pathname);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

    const element = screen.current;
    if (element === null || !("animate" in element)) return;

    const direction = toIndex > fromIndex ? 1 : -1;
    element.animate(
      [
        { transform: `translateX(${direction * SLIDE}px)`, opacity: 0 },
        { transform: "none", opacity: 1 },
      ],
      { duration: DURATION, easing: "ease-out" },
    );
  }, [pathname]);

  // 미끄러지는 동안 가로로 넘치면 보이는 영역이 다시 잡혀 화면이 흔들린다.
  // 넘치는 쪽만 잘라내며, `clip`은 스크롤 상자를 만들지 않아 붙어 있는 머리말이
  // 그대로 동작한다.
  return (
    <div className="overflow-x-clip">
      <div ref={screen}>{children}</div>
    </div>
  );
}
