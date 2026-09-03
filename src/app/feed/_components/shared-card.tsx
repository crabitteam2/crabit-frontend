"use client";
import Link from "next/link";
import { WishHeroContent } from "@/app/wishes/_components/wish-hero-screen";
import { getWishShareLook } from "@/app/wishes/_components/wish-share-theme";
import { toSavingPeriodLabel } from "@/app/wishes/_components/wish-period-format";
import { useEffect, useRef } from "react";
import type { components } from "@/lib/http/generated/crabit-backend";
import type { Impression } from "@/lib/behavior/collector";
export function SharedCard({
  card,
  impression,
  academyId,
}: {
  card: components["schemas"]["SharedCard"];
  impression?: Impression;
  academyId: string;
}) {
  const look = getWishShareLook({
    state: card.kind === "COMPLETION" ? "COMPLETED" : "IN_PROGRESS",
  });
  const period = toSavingPeriodLabel({
    start: card.startDate,
    end: card.targetDate,
  });
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!impression || !ref.current) return;
    let ratio = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        ratio = entries[0]?.intersectionRatio ?? 0;
        impression.visibility(
          ratio >= 0.5 && document.visibilityState === "visible",
        );
      },
      { threshold: [0, 0.5, 1] },
    );
    const visibility = () =>
      impression.visibility(
        ratio >= 0.5 && document.visibilityState === "visible",
      );
    observer.observe(ref.current);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      impression.detach();
    };
  }, [impression]);
  return (
    <article
      ref={ref}
      data-card-id={card.sharedCardId}
      className="border-gray-3 border-b py-5"
    >
      <div className="flex items-center justify-between px-4">
        <p className="font-semibold">{card.ownerNickname}의 위시리스트</p>
        <Link
          href={`/feed/${card.ownerId}?academyId=${academyId}`}
          onClick={() => impression?.click()}
          onAuxClick={(event) => {
            if (event.button === 1) impression?.click();
          }}
          className="bg-brand-weak text-fg-brand rounded-xl px-4 py-3"
        >
          방문하기
        </Link>
      </div>
      <div className="bg-pink-1 mt-4 flex flex-col pb-6">
        <WishHeroContent
          {...look}
          photoUrl={card.photo?.variants.medium ?? null}
          percent={card.progressPercent}
          purpose={card.purpose}
          period={period || null}
          amount={0}
          targetAmount={card.targetAmount}
          showAmount={false}
        />
      </div>
    </article>
  );
}
