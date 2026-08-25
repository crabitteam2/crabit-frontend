import { toProgressPercent } from "@/app/_components/progress-stage";
import { isFinishedWish, type Wish } from "@/lib/mock/wishes";
import { WishProgressBar } from "./wish-progress-bar";
import { detailWishTheme, finishedDetailWishTheme } from "./wish-theme";

interface WishSummaryCardProps {
  wish: Wish;
}

export function WishSummaryCard({ wish }: WishSummaryCardProps) {
  const percent = toProgressPercent(wish.amount, wish.targetAmount);
  const isFinished = isFinishedWish(wish);

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[20px] px-8 pt-7 pb-4 ${isFinished ? "bg-gray-1" : "bg-pink-6/5"}`}
    >
      <p className="text-t3 text-fg-neutral truncate pb-2 font-semibold">
        {wish.purpose}
      </p>
      <p className="text-fg-neutral-muted pb-6 text-[14px] leading-7 tracking-[-0.3px]">
        저축 기간: {wish.startDate} ~ {wish.targetDate}
      </p>
      <p className="text-pink-6 flex justify-end font-bold tracking-[-0.3px]">
        <span className="text-[28px] leading-[34px]">
          {wish.amount.toLocaleString("ko-KR")}
        </span>
        <span className="text-[26px] leading-[34px]">&nbsp;원</span>
      </p>
      <p className="text-fg-neutral-muted flex justify-end pb-3 text-[14px] leading-[34px] tracking-[-0.3px]">
        {wish.targetAmount.toLocaleString("ko-KR")} 원
      </p>
      <WishProgressBar
        percent={percent}
        theme={isFinished ? finishedDetailWishTheme : detailWishTheme}
      />
    </article>
  );
}
