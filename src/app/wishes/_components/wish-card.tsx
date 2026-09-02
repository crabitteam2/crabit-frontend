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
        className="flex flex-col gap-6 px-9 pt-7 pb-2"
        aria-label={`${wish.purpose} 모은 돈 기록`}
      >
        <span className={`flex h-7 items-center gap-1 ${onMore ? "pr-6" : ""}`}>
          <span className="text-t3 text-fg-neutral truncate font-medium">
            {wish.purpose}
          </span>
          {isRepresentative ? <Badge>대표</Badge> : null}
        </span>
        {wish.imageUrl === undefined ? null : (
          <Image
            src={wish.imageUrl}
            alt=""
            width={96}
            height={96}
            unoptimized
            className="mx-auto size-24 rounded-full object-cover"
          />
        )}
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
