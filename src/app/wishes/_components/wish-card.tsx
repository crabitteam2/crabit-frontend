import Image from "next/image";
import Link from "next/link";
import moreIcon from "@/../public/images/wishes/more.svg";
import { toProgressPercent } from "@/app/_components/progress-stage";
import { Badge } from "@/components/ui/badge";
import { toWishDisplayAmount } from "./wish-display-amount";
import type { WishItem } from "./wish-item";
import { WishProgressBar } from "./wish-progress-bar";
import { getWishTheme, type WishTone } from "./wish-theme";

interface WishCardProps {
  wish: WishItem;
  tone: WishTone;
  isRepresentative?: boolean;
  onMore?: (wish: WishItem) => void;
}

export function WishCard({
  wish,
  tone,
  isRepresentative,
  onMore,
}: WishCardProps) {
  const percent = toProgressPercent(
    toWishDisplayAmount(wish),
    wish.targetAmount,
  );
  const theme = getWishTheme(wish, tone, percent);

  return (
    <article
      className={`relative overflow-hidden rounded-[20px] ${theme.card}`}
    >
      <Link
        href={`/wishes/${wish.id}`}
        className="flex flex-col px-9 pt-7 pb-2"
        aria-label={`${wish.purpose} 모은 돈 기록`}
      >
        <span className={`flex h-7 items-center gap-1 ${onMore ? "pr-6" : ""}`}>
          <span className="text-t3 text-fg-neutral truncate font-medium">
            {wish.purpose}
          </span>
          {isRepresentative ? (
            <Badge className="bg-gray-10 text-white">대표</Badge>
          ) : null}
          {wish.visibility === "PRIVATE" ? null : (
            <Badge className="border-gray-9 text-fg-neutral border">
              학원 피드
            </Badge>
          )}
        </span>
        <span
          className={`flex justify-end pt-6 font-bold tracking-[-0.3px] ${theme.amount}`}
        >
          <span className="text-[28px] leading-[34px]">
            {toWishDisplayAmount(wish).toLocaleString("ko-KR")}
          </span>
          <span className="text-[26px] leading-[34px]">&nbsp;원</span>
        </span>
        <span
          className={`flex justify-end pb-3 text-[14px] leading-[34px] tracking-[-0.3px] ${theme.goal}`}
        >
          {wish.targetAmount.toLocaleString("ko-KR")} 원
        </span>

        <WishProgressBar percent={percent} theme={theme} />
      </Link>
      {onMore ? (
        <button
          type="button"
          onClick={() => onMore(wish)}
          aria-label={`${wish.purpose} 더보기`}
          className="absolute top-[30px] right-9 block size-6"
        >
          <Image src={moreIcon} alt="" fill sizes="24px" />
        </button>
      ) : null}
    </article>
  );
}
