"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import avatarIcon from "@/../public/images/home/tab-avatar.svg";
import homeIcon from "@/../public/images/home/tab-home.svg";
import starIcon from "@/../public/images/home/tab-star.svg";

const COLLAPSE_AFTER = 120;
const SCROLL_THRESHOLD = 8;

/**
 * 홈 하단 탭 바를 렌더링하고 스크롤 방향에 따라 보조 아이콘을 접거나 펼칩니다.
 * 120px 아래에서 8px 이상 내려가면 접히고, 8px 이상 올라가면 다시 펼쳐집니다.
 */
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

  const sideIcon = `relative block shrink-0 overflow-hidden transition-all duration-300 motion-reduce:transition-none ${
    isCollapsed ? "w-0 opacity-0" : "opacity-100"
  }`;

  return (
    <div className="max-w-app pointer-events-none fixed inset-x-0 bottom-0 z-10 mx-auto h-0 w-full px-4">
      <nav
        aria-label="주요 화면"
        className={`bg-layer-default pointer-events-auto absolute bottom-[calc(2rem+env(safe-area-inset-bottom))] flex items-center rounded-full border-2 border-[#d9d9d9] py-4 transition-all duration-300 motion-reduce:transition-none ${
          isCollapsed
            ? "left-4 translate-x-0 gap-0 px-4"
            : "left-1/2 -translate-x-1/2 gap-8 px-[19px]"
        }`}
      >
        <span
          aria-hidden="true"
          className={`${sideIcon} h-[34px] ${isCollapsed ? "" : "w-[34px]"}`}
        >
          <Image src={homeIcon} alt="" fill sizes="34px" />
        </span>

        <span className="relative block size-[34px] shrink-0">
          <Image src={starIcon} alt="위시리스트" fill sizes="34px" />
        </span>

        <span
          aria-hidden="true"
          className={`${sideIcon} h-[29px] ${isCollapsed ? "" : "w-[29px]"}`}
        >
          <Image src={avatarIcon} alt="" fill sizes="29px" />
          <span className="absolute inset-0 flex items-center justify-center text-[19px] font-medium text-[#d9d9d9]">
            P
          </span>
        </span>
      </nav>
    </div>
  );
}
