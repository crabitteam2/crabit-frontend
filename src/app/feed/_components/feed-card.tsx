"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { WishHeroContent } from "@/app/wishes/_components/wish-hero-screen";
import { toSavingPeriodLabel } from "@/app/wishes/_components/wish-period-format";
import { getWishShareLook } from "@/app/wishes/_components/wish-share-theme";
import type { Impression } from "@/lib/behavior/collector";
import type { FeedCardItem } from "./feed-item";

const VISIBLE_RATIO = 0.5;

interface FeedCardProps {
  card: FeedCardItem;
  /** 방문하기를 눌렀을 때 갈 주소입니다. */
  href: string;
  /** 노출과 클릭을 기록할 대상이며, 없으면 기록하지 않습니다. */
  impression?: Impression;
}

export function FeedCard({ card, href, impression }: FeedCardProps) {
  const look = getWishShareLook(card);
  const period = toSavingPeriodLabel({
    start: card.startDate,
    end: card.targetDate,
  });
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (impression === undefined || element === null) return;

    let ratio = 0;
    const report = () =>
      impression.visibility(
        ratio >= VISIBLE_RATIO && document.visibilityState === "visible",
      );
    const observer = new IntersectionObserver(
      (entries) => {
        ratio = entries[0]?.intersectionRatio ?? 0;
        report();
      },
      { threshold: [0, VISIBLE_RATIO, 1] },
    );

    observer.observe(element);
    document.addEventListener("visibilitychange", report);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", report);
      impression.detach();
    };
  }, [impression]);

  return (
    <article ref={ref} className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-b2 text-fg-neutral truncate font-medium">
          {card.ownerNickname}의 위시리스트
        </p>
        <Link
          href={href}
          onClick={() => impression?.click()}
          className="bg-brand-weak text-fg-brand text-b4 flex h-10 shrink-0 items-center rounded-xl px-4 font-semibold"
        >
          방문하기
        </Link>
      </div>

      <div className="bg-pink-1 flex flex-col pb-6">
        <WishHeroContent
          character={look.character}
          photoUrl={card.imageUrl ?? null}
          headline={look.headline}
          headlinePaddingTop={look.headlinePaddingTop}
          headlinePaddingBottom={look.headlinePaddingBottom}
          percent={card.percent}
          theme={look.theme}
          purpose={card.purpose}
          period={period === "" ? null : period}
          amount={0}
          targetAmount={card.targetAmount}
          showAmount={false}
        />
      </div>
    </article>
  );
}
