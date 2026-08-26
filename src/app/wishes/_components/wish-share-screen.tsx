import Link from "next/link";
import { toProgressPercent } from "@/app/_components/progress-stage";
import type { Wish } from "@/lib/mock/wishes";
import { WishHeroScreen } from "./wish-hero-screen";
import { toSavingPeriodLabel } from "./wish-period-format";
import { getWishShareLook } from "./wish-share-theme";

interface WishShareScreenProps {
  wish: Wish;
  photoUrl: string | null;
  closeHref: string;
  writeHref: string;
}

export function WishShareScreen({
  wish,
  photoUrl,
  closeHref,
  writeHref,
}: WishShareScreenProps) {
  const look = getWishShareLook(wish);
  const period = toSavingPeriodLabel({
    start: wish.startDate,
    end: wish.targetDate,
  });

  return (
    <WishHeroScreen
      closeHref={closeHref}
      character={look.character}
      photoUrl={photoUrl}
      headline={look.headline}
      headlinePaddingTop={look.headlinePaddingTop}
      headlinePaddingBottom={look.headlinePaddingBottom}
      percent={toProgressPercent(wish.amount, wish.targetAmount)}
      theme={look.theme}
      purpose={wish.purpose}
      period={period === "" ? null : period}
      amount={wish.amount}
      targetAmount={wish.targetAmount}
    >
      <Link
        href={writeHref}
        className="bg-brand-solid text-fg-contrast text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold"
      >
        공유하기
      </Link>
    </WishHeroScreen>
  );
}
