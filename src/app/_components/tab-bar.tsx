"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import homeActiveIcon from "@/../public/images/home/tab-home-active.svg";
import homeIcon from "@/../public/images/home/tab-home.svg";
import starActiveIcon from "@/../public/images/home/tab-star-active.svg";
import starIcon from "@/../public/images/home/tab-star.svg";

const COLLAPSE_AFTER = 120;
const SCROLL_THRESHOLD = 8;

/** 탭 바 왼쪽 끝 위치입니다. `left-4`와 같은 값을 씁니다. */
const NAV_LEFT = 16;

/** 탭 바 좌우 안쪽 여백입니다. `px-[6px]`와 같은 값을 씁니다. */
const NAV_PADDING = 6;
/** 펼쳤을 때 탭 하나의 너비입니다. `w-[102px]`와 같은 값을 씁니다. */
const TAB_WIDTH = 102;
/** 접었을 때 남는 탭의 너비입니다. `w-10`과 같은 값을 씁니다. */
const COLLAPSED_TAB_WIDTH = 40;
/** 탭끼리 겹치는 너비입니다. `-mr-2`와 같은 값을 씁니다. */
const TAB_OVERLAP = 8;
/** 선택 표시가 탭보다 좌우로 더 나오는 너비입니다. */
const INDICATOR_BLEED = 2;

interface Tab {
  label: string;
  icon: StaticImageData;
  activeIcon: StaticImageData;
  href: string;
  matches: (pathname: string) => boolean;
}

const TABS: Tab[] = [
  {
    label: "홈",
    icon: homeIcon,
    activeIcon: homeActiveIcon,
    href: "/home",
    matches: (pathname) => pathname === "/home",
  },
  {
    label: "위시리스트",
    icon: starIcon,
    activeIcon: starActiveIcon,
    href: "/",
    matches: (pathname) => pathname === "/" || pathname.startsWith("/wishes"),
  },
];

/** 탭 바를 그리는 화면이며 탭에 놓인 순서와 같습니다. */
export const TAB_BAR_PATHS = TABS.map((tab) => tab.href);

/** 펼쳤을 때의 탭 바 너비입니다. */
const EXPANDED_WIDTH =
  NAV_PADDING * 2 + TABS.length * TAB_WIDTH - (TABS.length - 1) * TAB_OVERLAP;

/**
 * 펼쳤을 때 탭 바를 가운데로 보내는 거리입니다.
 *
 * 자기 너비가 아니라 펼친 너비로 계산한다. 접었다 펼치는 동안 너비가 함께
 * 변해서, 자기 너비를 쓰면 옮기는 거리가 매 순간 달라져 오른쪽으로 튄다.
 */
const CENTER_SHIFT = `translateX(calc((min(100vw, var(--container-app)) - ${EXPANDED_WIDTH}px) / 2 - ${NAV_LEFT}px))`;

export function TabBar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    let previous = window.scrollY;

    const onScroll = () => {
      const current = window.scrollY;
      if (Math.abs(current - previous) < SCROLL_THRESHOLD) return;
      setIsCollapsed(current > previous && current > COLLAPSE_AFTER);
      previous = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!TAB_BAR_PATHS.includes(pathname)) return null;

  const currentIndex = TABS.findIndex((tab) => tab.matches(pathname));
  const currentLeft = isCollapsed
    ? NAV_PADDING
    : NAV_PADDING + Math.max(currentIndex, 0) * (TAB_WIDTH - TAB_OVERLAP);

  return (
    <div className="max-w-app pointer-events-none fixed inset-x-0 bottom-0 z-10 mx-auto h-0 w-full">
      <nav
        aria-label="주요 화면"
        style={{ transform: isCollapsed ? "none" : CENTER_SHIFT }}
        className="pointer-events-auto absolute bottom-[max(25px,env(safe-area-inset-bottom))] left-4 flex rounded-full bg-white/50 px-[6px] py-1 shadow-[0_8px_40px_rgba(0,0,0,0.12)] ring-1 ring-white/50 backdrop-blur-2xl backdrop-saturate-150 transition-transform duration-300 motion-reduce:transition-none"
      >
        <span
          aria-hidden="true"
          style={{
            left: currentLeft - INDICATOR_BLEED,
            width:
              (isCollapsed ? COLLAPSED_TAB_WIDTH : TAB_WIDTH) +
              INDICATOR_BLEED * 2,
          }}
          className={`pointer-events-none absolute top-1 bottom-[3.5px] rounded-full bg-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-white/60 backdrop-blur-sm transition-all duration-300 motion-reduce:transition-none ${
            currentIndex === -1 ? "opacity-0" : "opacity-100"
          }`}
        />

        {TABS.map((tab, index) => {
          const isCurrent = tab.matches(pathname);
          const className = `relative flex flex-col items-center justify-center gap-px pt-[6px] pb-[7px] transition-all duration-300 motion-reduce:transition-none ${
            isCurrent ? "" : "overflow-hidden"
          } ${
            isCollapsed
              ? isCurrent
                ? "w-10 px-2"
                : "w-0 px-0 opacity-0"
              : "w-[102px] px-2"
          } ${isCollapsed || index === TABS.length - 1 ? "" : "-mr-2"}`;

          const content = (
            <>
              <span className="relative block size-6 shrink-0">
                <Image
                  src={isCurrent ? tab.activeIcon : tab.icon}
                  alt=""
                  fill
                  sizes="24px"
                />
              </span>
              <span
                className={`relative overflow-hidden text-[10px] leading-3 font-semibold tracking-[-0.1px] transition-all duration-300 motion-reduce:transition-none ${
                  isCollapsed ? "h-0 opacity-0" : "h-3 opacity-100"
                } ${isCurrent ? "text-fg-brand" : "text-fg-neutral"}`}
              >
                {tab.label}
              </span>
            </>
          );

          return (
            <Link
              key={tab.label}
              href={tab.href}
              replace
              aria-current={isCurrent ? "page" : undefined}
              className={className}
            >
              {content}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
