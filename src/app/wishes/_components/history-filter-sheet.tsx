"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";

export const PERIODS = ["이번달", "3개월", "6개월", "1년"] as const;
export const SORTS = ["최신순", "과거순"] as const;

export type HistoryPeriod = (typeof PERIODS)[number];
export type HistorySort = (typeof SORTS)[number];

interface HistoryFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  period: HistoryPeriod;
  sort: HistorySort;
  onPeriodChange: (period: HistoryPeriod) => void;
  onSortChange: (sort: HistorySort) => void;
  onReset: () => void;
  onApply: () => void;
}

export function HistoryFilterSheet({
  isOpen,
  onClose,
  period,
  sort,
  onPeriodChange,
  onSortChange,
  onReset,
  onApply,
}: HistoryFilterSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="저축 기록 내역"
      compactHeader
    >
      <p className="text-t3 text-fg-neutral flex h-[34px] w-full items-start pb-2 font-medium">
        조회 기간
      </p>
      <div
        role="radiogroup"
        aria-label="조회 기간"
        className="bg-gray-1 flex h-[60px] w-full items-center overflow-hidden rounded-2xl"
      >
        {PERIODS.map((item) => (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={item === period}
            onClick={() => onPeriodChange(item)}
            className={`text-b4 flex h-full flex-1 items-center justify-center rounded-2xl font-semibold ${
              item === period ? "bg-pink-6 text-white" : "text-fg-brand"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="text-t3 text-fg-neutral flex w-full items-start pt-6 pb-2 font-medium">
        정렬 순서
      </p>
      <div
        role="radiogroup"
        aria-label="정렬 순서"
        className="bg-gray-1 flex h-[60px] w-full items-center rounded-2xl"
      >
        {SORTS.map((item) => (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={item === sort}
            onClick={() => onSortChange(item)}
            className={`text-b4 text-fg-brand flex h-[60px] flex-1 items-center justify-center rounded-2xl border-2 font-semibold ${
              item === sort ? "border-pink-6" : "border-transparent"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex w-full items-center gap-4 pt-12 pb-5">
        <button
          type="button"
          onClick={onReset}
          className="bg-neutral-weak text-b3 text-fg-brand h-[60px] flex-1 rounded-xl font-semibold"
        >
          초기화
        </button>
        <button
          type="button"
          onClick={onApply}
          className="bg-brand-solid text-b3 text-fg-contrast h-[60px] flex-1 rounded-xl font-semibold"
        >
          적용하기
        </button>
      </div>
    </BottomSheet>
  );
}
