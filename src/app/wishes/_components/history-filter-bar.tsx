"use client";

import Image from "next/image";
import { useState } from "react";
import searchIcon from "@/../public/images/wishes/search.svg";
import swapIcon from "@/../public/images/wishes/swap.svg";
import {
  HistoryFilterSheet,
  type HistoryPeriod,
  type HistorySort,
} from "./history-filter-sheet";

export const DEFAULT_PERIOD: HistoryPeriod = "3개월";

export const DEFAULT_SORT: HistorySort = "최신순";

interface HistoryFilterBarProps {
  /** 현재 조회 기간입니다. */
  period: HistoryPeriod;
  /** 현재 정렬 기준입니다. */
  sort: HistorySort;
  /** 적용 버튼을 눌렀을 때 호출됩니다. */
  onApply: (period: HistoryPeriod, sort: HistorySort) => void;
}

export function HistoryFilterBar({
  period,
  sort,
  onApply,
}: HistoryFilterBarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [draftPeriod, setDraftPeriod] = useState<HistoryPeriod>(period);
  const [draftSort, setDraftSort] = useState<HistorySort>(sort);

  const openSheet = () => {
    setDraftPeriod(period);
    setDraftSort(sort);
    setIsSheetOpen(true);
  };

  return (
    <div className="flex items-center px-4 pt-11 pb-4">
      <button
        type="button"
        aria-label="모은 돈 기록 검색"
        className="relative block size-8 shrink-0"
      >
        <Image src={searchIcon} alt="" fill sizes="32px" />
      </button>
      <div className="flex flex-1 items-center justify-end gap-4">
        <button
          type="button"
          onClick={openSheet}
          className="text-t3 text-fg-neutral font-medium"
        >
          {period}
        </button>
        <button
          type="button"
          onClick={openSheet}
          className="text-t3 text-fg-neutral font-medium"
        >
          {sort}
        </button>
        <button
          type="button"
          aria-label="조회 기간과 정렬 변경"
          onClick={openSheet}
          className="relative block size-8 shrink-0 rotate-90"
        >
          <Image src={swapIcon} alt="" fill sizes="32px" />
        </button>
      </div>

      <HistoryFilterSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        period={draftPeriod}
        sort={draftSort}
        onPeriodChange={setDraftPeriod}
        onSortChange={setDraftSort}
        onReset={() => {
          setDraftPeriod(DEFAULT_PERIOD);
          setDraftSort(DEFAULT_SORT);
        }}
        onApply={() => {
          onApply(draftPeriod, draftSort);
          setIsSheetOpen(false);
        }}
      />
    </div>
  );
}
