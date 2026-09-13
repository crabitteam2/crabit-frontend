"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { RecapMonthTab } from "./monthly-recap-screen";

interface RecapMonthTabsProps {
  months: readonly RecapMonthTab[];
  /** 고른 달의 글자색입니다. */
  currentStyle: string;
  /** 나머지 달의 글자색입니다. */
  restStyle: string;
}

/** 한 해의 달을 가로로 넘겨 고르며, 고른 달이 보이도록 맞춰 둡니다. */
export function RecapMonthTabs({
  months,
  currentStyle,
  restStyle,
}: RecapMonthTabsProps) {
  const currentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, []);

  return (
    <nav
      aria-label="월 선택"
      className="no-scrollbar relative flex gap-[49.5px] overflow-x-auto px-6 py-5"
    >
      {months.map((month) =>
        month.href === null ? (
          <span
            key={month.label}
            ref={currentRef}
            aria-current="page"
            className={`shrink-0 text-[20px] leading-7 font-medium tracking-[-0.3px] whitespace-nowrap ${currentStyle}`}
          >
            {month.label}
          </span>
        ) : (
          <Link
            key={month.label}
            href={month.href}
            className={`shrink-0 text-[20px] leading-7 font-medium tracking-[-0.3px] whitespace-nowrap ${restStyle}`}
          >
            {month.label}
          </Link>
        ),
      )}
    </nav>
  );
}
