"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import collectIcon from "@/../public/images/home/tab-collect.svg";
import homeIcon from "@/../public/images/home/tab-home.svg";
import starIcon from "@/../public/images/home/tab-star.svg";

const COLLAPSE_AFTER = 120;
const SCROLL_THRESHOLD = 8;

interface Tab {
  label: string;
  icon: StaticImageData;
  isCurrent?: boolean;
}

const TABS: Tab[] = [
  { label: "홈", icon: homeIcon },
  { label: "위시리스트", icon: starIcon, isCurrent: true },
  { label: "모으기", icon: collectIcon },
];

export function TabBar() {
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
        {TABS.map((tab, index) => (
          <span
            key={tab.label}
            aria-current={tab.isCurrent ? "page" : undefined}
            className={`relative flex flex-col items-center justify-center gap-px pt-[6px] pb-[7px] transition-all duration-300 motion-reduce:transition-none ${
              tab.isCurrent ? "" : "overflow-hidden"
            } ${
              isCollapsed
                ? tab.isCurrent
                  ? "w-10 px-2"
                  : "w-0 px-0 opacity-0"
                : "w-[102px] px-2"
            } ${isCollapsed || index === TABS.length - 1 ? "" : "-mr-2"}`}
          >
            {tab.isCurrent ? (
              <span
                aria-hidden="true"
                className="absolute -inset-x-[2px] top-0 -bottom-[0.5px] rounded-full bg-[#ededed]"
              />
            ) : null}
            <span className="relative block size-6 shrink-0">
              <Image src={tab.icon} alt="" fill sizes="24px" />
            </span>
            <span
              className={`relative overflow-hidden text-[10px] leading-3 font-semibold tracking-[-0.1px] transition-all duration-300 motion-reduce:transition-none ${
                isCollapsed ? "h-0 opacity-0" : "h-3 opacity-100"
              } ${tab.isCurrent ? "text-fg-brand" : "text-fg-neutral"}`}
            >
              {tab.label}
            </span>
          </span>
        ))}
      </nav>
    </div>
  );
}
