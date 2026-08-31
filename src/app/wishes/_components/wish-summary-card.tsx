import Image from "next/image";
import { toProgressPercent } from "@/app/_components/progress-stage";
import { toWishDisplayAmount } from "./wish-display-amount";
import { toSavingPeriodLabel } from "./wish-period-format";
import { isFinishedState, type WishDetail } from "./wish-detail";
import { WishProgressBar } from "./wish-progress-bar";
import {
  abandonedDetailWishTheme,
  detailWishTheme,
  finishedDetailWishTheme,
  reachedDetailWishTheme,
} from "./wish-theme";

const PHOTO_SIZE = 64;

interface WishSummaryCardProps {
  wish: WishDetail;
}

function summaryTheme(wish: WishDetail) {
  if (wish.state === "ABANDONED") return abandonedDetailWishTheme;
  if (wish.state === "COMPLETED") return finishedDetailWishTheme;
  if (wish.amount >= wish.targetAmount) return reachedDetailWishTheme;
  return detailWishTheme;
}

export function WishSummaryCard({ wish }: WishSummaryCardProps) {
  const displayAmount = toWishDisplayAmount(wish);
  const percent = toProgressPercent(displayAmount.amount, wish.targetAmount);
  const isFinished = isFinishedState(wish.state);
  const period =
    wish.targetDate === ""
      ? ""
      : toSavingPeriodLabel({ start: wish.startDate, end: wish.targetDate });

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[20px] px-8 pt-7 pb-4 ${isFinished ? "bg-gray-1" : "bg-pink-6/5"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col">
          <p className="text-t3 text-fg-neutral truncate pb-2 font-semibold">
            {wish.purpose}
          </p>
          {period === "" ? null : (
            <p className="text-fg-neutral-muted pb-6 text-[14px] leading-7 tracking-[-0.3px]">
              기간: {period}
            </p>
          )}
        </div>
        {wish.imageUrl === undefined ? null : (
          <Image
            src={wish.imageUrl}
            alt=""
            width={PHOTO_SIZE}
            height={PHOTO_SIZE}
            unoptimized
            className="size-16 shrink-0 rounded-full object-cover"
          />
        )}
      </div>
      {displayAmount.label === null ? null : (
        <p className="text-fg-neutral-muted flex justify-end text-[14px] leading-6 tracking-[-0.3px]">
          {displayAmount.label}
        </p>
      )}
      <p className="text-pink-6 flex justify-end font-bold tracking-[-0.3px]">
        <span className="text-[28px] leading-[34px]">
          {displayAmount.amount.toLocaleString("ko-KR")}
        </span>
        <span className="text-[26px] leading-[34px]">&nbsp;원</span>
      </p>
      <p className="text-fg-neutral-muted flex justify-end pb-3 text-[14px] leading-[34px] tracking-[-0.3px]">
        {wish.targetAmount.toLocaleString("ko-KR")} 원
      </p>
      <WishProgressBar percent={percent} theme={summaryTheme(wish)} />
    </article>
  );
}
