"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { RecapMonthTab } from "./monthly-recap-screen";

interface RecapMonthTabsProps {
  year: number;
  months: readonly RecapMonthTab[];
  /** 고른 달의 글자색입니다. */
  currentStyle: string;
  /** 나머지 달의 글자색입니다. */
  restStyle: string;
}

/** 첫 진입과 연도 변경에만 선택 월을 맞추고, 같은 해의 월 이동은 위치를 유지합니다. */
export function RecapMonthTabs({
  year,
  months,
  currentStyle,
  restStyle,
}: RecapMonthTabsProps) {
  const stripRef = useRef<HTMLElement>(null);
  const positionedYear = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (positionedYear.current === year) return;
    const strip = stripRef.current;
    const current = strip?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!strip || !current) return;
    const stripBox = strip.getBoundingClientRect();
    const currentBox = current.getBoundingClientRect();
    strip.scrollLeft +=
      currentBox.left -
      stripBox.left -
      (strip.clientWidth - currentBox.width) / 2;
    positionedYear.current = year;
  }, [year]);

  return (
    <nav
      ref={stripRef}
      aria-label="월 선택"
      className="no-scrollbar relative flex gap-[49.5px] overflow-x-auto px-6 py-5"
    >
      {months.map((month, index) => (
        <Link
          key={month.label}
          href={
            month.href ??
            `/recaps/monthly?month=${year}-${String(index + 1).padStart(2, "0")}`
          }
          scroll={false}
          aria-current={month.href === null ? "page" : undefined}
          onClick={
            month.href === null
              ? (event) => {
                  event.preventDefault();
                }
              : undefined
          }
          className={`shrink-0 text-[20px] leading-7 font-medium tracking-[-0.3px] whitespace-nowrap ${month.href === null ? currentStyle : restStyle}`}
        >
          {month.label}
        </Link>
      ))}
    </nav>
  );
}
