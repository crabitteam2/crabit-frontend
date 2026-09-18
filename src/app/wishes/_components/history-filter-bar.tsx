"use client";

import Image from "next/image";
import { useState } from "react";
import closeIcon from "@/../public/images/wishes/close-12.svg";
import searchIcon from "@/../public/images/wishes/search.svg";
import swapIcon from "@/../public/images/wishes/swap.svg";
import {
  HistoryFilterSheet,
  type HistoryPeriod,
  type HistorySort,
} from "./history-filter-sheet";
import {
  HistorySearchDialog,
  type HistorySearchKind,
} from "./history-search-dialog";

export const DEFAULT_PERIOD: HistoryPeriod = "3개월";

export const DEFAULT_SORT: HistorySort = "최신순";

interface HistoryFilterBarProps {
  /** 현재 조회 기간입니다. */
  period: HistoryPeriod;
  /** 현재 정렬 기준입니다. */
  sort: HistorySort;
  /** 지금 고른 기록 종류이며 고른 것이 없으면 null입니다. */
  kind: HistorySearchKind | null;
  /** 적용 버튼을 눌렀을 때 호출됩니다. */
  onApply: (period: HistoryPeriod, sort: HistorySort) => void;
  /** 기록 종류를 고르거나 해제했을 때 호출됩니다. */
  onKindChange: (kind: HistorySearchKind | null) => void;
}

export function HistoryFilterBar({
  period,
  sort,
  kind,
  onApply,
  onKindChange,
}: HistoryFilterBarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [draftPeriod, setDraftPeriod] = useState<HistoryPeriod>(period);
  const [draftSort, setDraftSort] = useState<HistorySort>(sort);

  const openSheet = () => {
    setDraftPeriod(period);
    setDraftSort(sort);
    setIsSheetOpen(true);
  };

  return (
    <div className="flex items-center px-4 pt-11 pb-4">
      <div className="flex min-w-0 items-center gap-1">
        <button
          type="button"
          aria-label="모은 돈 기록 찾기"
          onClick={() => setIsSearchOpen(true)}
          className="relative block size-8 shrink-0"
        >
          <Image src={searchIcon} alt="" fill sizes="32px" />
        </button>
        {kind === null ? null : (
          <button
            type="button"
            aria-label={`${kind} 찾기 해제`}
            onClick={() => onKindChange(null)}
            className="bg-neutral-inverted text-fg-neutral-inverted text-e1 flex h-8 shrink-0 items-center gap-1 rounded-xl px-3 font-semibold"
          >
            {kind}
            <span aria-hidden="true" className="relative block size-3">
              <Image src={closeIcon} alt="" fill sizes="12px" />
            </span>
          </button>
        )}
      </div>
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

      <HistorySearchDialog
        isOpen={isSearchOpen}
        kind={kind}
        onSelect={(next) => {
          onKindChange(next);
          setIsSearchOpen(false);
        }}
        onClose={() => setIsSearchOpen(false)}
      />

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
