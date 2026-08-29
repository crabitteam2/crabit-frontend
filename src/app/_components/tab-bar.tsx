"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import collectIcon from "@/../public/images/home/tab-collect.svg";
import homeActiveIcon from "@/../public/images/home/tab-home-active.svg";
import homeIcon from "@/../public/images/home/tab-home.svg";
import starActiveIcon from "@/../public/images/home/tab-star-active.svg";
import starIcon from "@/../public/images/home/tab-star.svg";

const COLLAPSE_AFTER = 120;
const SCROLL_THRESHOLD = 8;

interface Tab {
  label: string;
  icon: StaticImageData;
  activeIcon: StaticImageData;
  href: string | null;
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
  {
    label: "모으기",
    icon: collectIcon,
    activeIcon: collectIcon,
    href: null,
    matches: () => false,
  },
];

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

  return (
    <div className="max-w-app pointer-events-none fixed inset-x-0 bottom-0 z-10 mx-auto h-0 w-full">
      <nav
        aria-label="주요 화면"
        className={`pointer-events-auto absolute bottom-[max(25px,env(safe-area-inset-bottom))] flex rounded-full bg-white/65 px-[6px] py-1 shadow-[0_8px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 motion-reduce:transition-none ${
          isCollapsed ? "left-4 translate-x-0" : "left-1/2 -translate-x-1/2"
        }`}
      >
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
              {isCurrent ? (
                <span
                  aria-hidden="true"
                  className="absolute -inset-x-[2px] top-0 -bottom-[0.5px] rounded-full bg-[#ededed]"
                />
              ) : null}
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

          if (tab.href === null) {
            return (
              <span key={tab.label} className={className}>
                {content}
              </span>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
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
