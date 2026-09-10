"use client";

import { useEffect, useRef, useState } from "react";
import { PullToRefresh } from "@/app/_components/pull-to-refresh";
import { TopButton } from "@/app/wishes/_components/top-button";
import { Impression } from "@/lib/behavior/collector";
import type { components } from "@/lib/http/generated/crabit-backend";
import { ACADEMY_NAME } from "@/lib/mock/home";
import { behaviorRead, useBehaviorSession } from "./behavior-session";
import { EmptyFeed } from "./empty-feed";
import { FeedCard } from "./feed-card";
import { FeedHeader } from "./feed-header";
import { toFeedCardItem } from "./feed-item";

const PAGE_LIMIT = 100;

type FeedResult = components["schemas"]["FeedResultResponse"];

export function FeedScreen() {
  const session = useBehaviorSession();
  const [result, setResult] = useState<FeedResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const version = useRef(0);
  const impressions = useRef(new Map<string, Impression>());

  const clearImpressions = () => {
    for (const impression of impressions.current.values()) impression.end();
    impressions.current.clear();
  };

  const load = async () => {
    if (session === null) return;

    const current = ++version.current;
    setIsLoading(true);
    setHasError(false);
    session.entry.queue.discardPending();
    clearImpressions();

    try {
      const page = await behaviorRead<FeedResult>(
        session.context,
        "feed-results",
        { method: "POST", body: JSON.stringify({ limit: PAGE_LIMIT }) },
      );
      if (version.current === current) setResult(page);
    } catch {
      if (version.current === current) setHasError(true);
    } finally {
      if (version.current === current) setIsLoading(false);
    }
  };

  useEffect(() => {
    const store = impressions.current;
    void load();
    return () => {
      version.current++;
      for (const impression of store.values()) impression.end();
      store.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.entry]);

  if (session === null) return null;

  const cards = result?.items ?? [];
  if (!isLoading && !hasError && cards.length === 0) return <EmptyFeed />;

  return (
    <div className="flex flex-col">
      <FeedHeader academyName={ACADEMY_NAME} backHref="/" sortLabel="추천순" />

      <PullToRefresh onRefresh={load}>
        {hasError ? (
          <p
            role="alert"
            className="text-fg-neutral-muted px-4 py-10 text-center"
          >
            피드를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        ) : (
          <ul className="flex flex-col pb-10">
            {cards.map((card, position) => {
              const key = `${result?.resultContextId}:${card.sharedCardId}`;
              let impression = impressions.current.get(key);
              if (impression === undefined && result !== null) {
                impression = new Impression(
                  {
                    resultContextId: result.resultContextId,
                    cardId: card.sharedCardId,
                    position,
                    expiresAt: Date.parse(result.expiresAt),
                  },
                  session.entry.queue,
                );
                impressions.current.set(key, impression);
              }

              return (
                <li key={key}>
                  <FeedCard
                    card={toFeedCardItem(card)}
                    href={`/feed/${card.ownerId}?academyId=${session.context.academyId}`}
                    impression={impression}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </PullToRefresh>

      <TopButton />
    </div>
  );
}
