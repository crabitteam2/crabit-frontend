import Image, { type StaticImageData } from "next/image";
import abandonedThumb from "@/../public/images/feed/thumb-abandoned.png";
import completedThumb from "@/../public/images/feed/thumb-completed.png";
import inProgressThumb from "@/../public/images/feed/thumb-in-progress.png";
import { toSavingPeriodLabel } from "@/app/wishes/_components/wish-period-format";
import { WishProgressBar } from "@/app/wishes/_components/wish-progress-bar";
import {
  getWishTheme,
  type WishTone,
} from "@/app/wishes/_components/wish-theme";
import type { WishItemState } from "@/app/wishes/_components/wish-item";
import type { ProfileWishItem } from "./feed-item";

const thumbnails: Record<WishItemState, StaticImageData> = {
  IN_PROGRESS: inProgressThumb,
  AMOUNT_REACHED: inProgressThumb,
  COMPLETED: completedThumb,
  ABANDONED: abandonedThumb,
};

interface ProfileWishCardProps {
  wish: ProfileWishItem;
  tone: WishTone;
}

export function ProfileWishCard({ wish, tone }: ProfileWishCardProps) {
  const percent = wish.percent;
  const theme = getWishTheme(wish, tone, percent);
  const period = toSavingPeriodLabel({
    start: wish.startDate,
    end: wish.targetDate,
  });

  return (
    <article
      className={`h-[186px] overflow-hidden rounded-[20px] ${theme.card}`}
    >
      <div className="flex items-start justify-between px-9 pt-7">
        <div className="flex min-w-0 flex-col">
          <p className="text-t3 text-fg-neutral truncate font-bold">
            {wish.purpose}
          </p>
          <p className="text-b4 text-fg-neutral flex h-7 items-center font-medium">
            기간: {period === "" ? "설정된 기간 없음" : period}
          </p>
        </div>
        {wish.imageUrl === undefined ? (
          <Image
            src={thumbnails[wish.state]}
            alt=""
            width={60}
            height={60}
            className="size-15 shrink-0 rounded-full"
          />
        ) : (
          <Image
            src={wish.imageUrl}
            alt=""
            width={60}
            height={60}
            className="size-15 shrink-0 rounded-full object-cover"
          />
        )}
      </div>
      <div className="px-9 pt-6">
        <WishProgressBar percent={percent} theme={theme} />
      </div>
    </article>
  );
}
