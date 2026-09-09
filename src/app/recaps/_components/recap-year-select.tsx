"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import chevronIcon from "@/../public/images/common/chevron-right.svg";
import { listRecapYearsAction } from "../recap-actions";

interface RecapYearSelectProps {
  /** 지금 보고 있는 연도입니다. */
  year: number;
  /** 글자와 화살표를 흰색으로 그릴지 여부입니다. */
  isOnDarkBackground?: boolean;
}

/**
 * 헤더 오른쪽에서 연도를 고르는 드롭다운입니다.
 *
 * 리캡이 있는 연도는 열 때 조회합니다. 화면마다 미리 받아두면 쓰지 않는 조회가 많아집니다.
 */
export function RecapYearSelect({
  year,
  isOnDarkBackground = false,
}: RecapYearSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [years, setYears] = useState<readonly number[]>([year]);
  const [isLoading, startLoading] = useTransition();
  const tone = isOnDarkBackground ? "text-static-white" : "text-fg-neutral";

  function open() {
    setIsOpen(true);
    if (years.length > 1 || isLoading) return;
    startLoading(async () => {
      const loaded = await listRecapYearsAction();
      setYears(loaded.includes(year) ? loaded : [...loaded, year].sort());
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        className={`relative z-20 flex items-center gap-1 text-[15px] leading-5 font-medium tracking-[-0.3px] ${tone}`}
      >
        {year}
        <span
          className={`relative block size-4 rotate-90 ${isOnDarkBackground ? "brightness-0 invert" : ""}`}
        >
          <Image src={chevronIcon} alt="" fill sizes="16px" />
        </span>
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="연도 선택 닫기"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <ul
            aria-label="연도 선택"
            aria-busy={isLoading}
            className="bg-layer-fill fixed top-[env(safe-area-inset-top)] left-6 z-20 flex w-[270px] flex-col gap-[10px] rounded-[15px] p-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.08)]"
          >
            {years.map((candidate) => (
              <li key={candidate}>
                <Link
                  href={`/recaps/monthly?year=${candidate}`}
                  aria-current={candidate === year ? "true" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 text-[16px] leading-[23px] tracking-[-0.3px] ${
                    candidate === year
                      ? "text-gray-9 font-semibold"
                      : "text-gray-7 font-medium"
                  }`}
                >
                  {candidate}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
