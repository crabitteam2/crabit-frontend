import Image from "next/image";
import searchIcon from "@/../public/images/wishes/search.svg";
import swapIcon from "@/../public/images/wishes/swap.svg";

interface HistoryFilterBarProps {
  period: string;
  sort: string;
}

export function HistoryFilterBar({ period, sort }: HistoryFilterBarProps) {
  return (
    <div className="flex items-center px-4 pt-11 pb-4">
      <button
        type="button"
        aria-label="저축 기록 검색"
        className="relative block size-8 shrink-0"
      >
        <Image src={searchIcon} alt="" fill sizes="32px" />
      </button>
      <div className="flex flex-1 items-center justify-end gap-4">
        <button type="button" className="text-t3 text-fg-neutral font-medium">
          {period}
        </button>
        <button type="button" className="text-t3 text-fg-neutral font-medium">
          {sort}
        </button>
        <button
          type="button"
          aria-label="정렬 뒤집기"
          className="relative block size-8 shrink-0 rotate-90"
        >
          <Image src={swapIcon} alt="" fill sizes="32px" />
        </button>
      </div>
    </div>
  );
}
