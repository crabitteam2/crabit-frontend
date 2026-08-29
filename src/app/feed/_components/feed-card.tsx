import { toProgressPercent } from "@/app/_components/progress-stage";
import { WishHeroContent } from "@/app/wishes/_components/wish-hero-screen";
import { toSavingPeriodLabel } from "@/app/wishes/_components/wish-period-format";
import { getWishShareLook } from "@/app/wishes/_components/wish-share-theme";
import type { FeedCard as FeedCardData } from "@/lib/mock/feed";

interface FeedCardProps {
  card: FeedCardData;
}

export function FeedCard({ card }: FeedCardProps) {
  const { ownerNickname, wish } = card;
  const look = getWishShareLook(wish);
  const period = toSavingPeriodLabel({
    start: wish.startDate,
    end: wish.targetDate,
  });

  return (
    <article className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-b2 text-fg-neutral truncate font-medium">
          {ownerNickname}의 위시리스트
        </p>
        <button
          type="button"
          className="bg-brand-weak text-fg-brand text-b4 flex h-10 shrink-0 items-center rounded-xl px-4 font-semibold"
        >
          방문하기
        </button>
      </div>

      <div className="bg-pink-1 flex flex-col pb-6">
        <WishHeroContent
          character={look.character}
          photoUrl={null}
          headline={look.headline}
          headlinePaddingTop={look.headlinePaddingTop}
          headlinePaddingBottom={look.headlinePaddingBottom}
          percent={toProgressPercent(wish.amount, wish.targetAmount)}
          theme={look.theme}
          purpose={wish.purpose}
          period={period === "" ? null : period}
          amount={wish.amount}
          targetAmount={wish.targetAmount}
          showAmount={false}
        />
      </div>
    </article>
  );
}
