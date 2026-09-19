"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PullToRefresh } from "@/app/_components/pull-to-refresh";
import { TopButton } from "@/app/wishes/_components/top-button";
import { Impression } from "@/lib/behavior/collector";
import { ACADEMY_NAME } from "@/lib/mock/home";
import {
  behaviorRead,
  BehaviorReadError,
  useBehaviorSession,
} from "./behavior-session";
import { EmptyFeed } from "./empty-feed";
import { ErrorScreen } from "@/app/_components/error-screen";
import { FeedCard } from "./feed-card";
import { FeedHeader } from "./feed-header";
import { toFeedCardItem } from "./feed-item";
import { FeedSkeleton } from "./feed-skeleton";
import {
  appendFeedPage,
  FEED_PAGE_LIMIT,
  type FeedPage,
  type FeedRow,
} from "./feed-pagination";

type Failure = "retry" | "expired" | "forbidden" | "cycle";

export function FeedScreen() {
  const session = useBehaviorSession();
  const context = session?.context;
  const entry = session?.entry;
  const [rows, setRows] = useState<FeedRow[]>([]);
  const [owner, setOwner] = useState(entry);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [sortSource, setSortSource] = useState<FeedPage["sortSource"] | null>(
    null,
  );
  const generation = useRef(0);
  const inFlight = useRef(false);
  const autoPaused = useRef(true);
  const abort = useRef<AbortController | null>(null);
  const processed = useRef(new Set<string>());
  const impressions = useRef(new Map<string, Impression>());
  const sentinel = useRef<HTMLDivElement>(null);

  const clearImpressions = useCallback(() => {
    for (const impression of impressions.current.values()) impression.end();
    impressions.current.clear();
  }, []);

  const requestPage = useCallback(
    async (next: string | null, replace: boolean) => {
      if (
        !context ||
        !entry ||
        (!replace &&
          (inFlight.current || (next !== null && processed.current.has(next))))
      )
        return;
      if (replace) {
        generation.current++;
        abort.current?.abort();
        processed.current.clear();
        entry.queue.discardPending();
        clearImpressions();
        setOwner(entry);
        setRows([]);
        setCursor(null);
        setSortSource(null);
      }
      const current = generation.current;
      const controller = new AbortController();
      abort.current = controller;
      inFlight.current = true;
      autoPaused.current = true;
      setIsLoading(true);
      setFailure(null);
      try {
        const page = await behaviorRead<FeedPage>(context, "feed-results", {
          method: "POST",
          body: JSON.stringify({
            limit: FEED_PAGE_LIMIT,
            ...(next === null ? {} : { cursor: next }),
          }),
          signal: controller.signal,
        });
        if (generation.current !== current || controller.signal.aborted) return;
        if (next !== null) processed.current.add(next);
        setRows((previous) => appendFeedPage(replace ? [] : previous, page));
        if (replace) setSortSource(page.sortSource);
        if (
          page.nextCursor !== null &&
          processed.current.has(page.nextCursor)
        ) {
          setCursor(null);
          setFailure("cycle");
        } else {
          autoPaused.current = false;
          setCursor(page.nextCursor);
        }
      } catch (error) {
        if (generation.current !== current || controller.signal.aborted) return;
        setFailure(
          error instanceof BehaviorReadError &&
            (error.status === 410 ||
              error.code === "RECOMMENDATION_CURSOR_EXPIRED")
            ? "expired"
            : error instanceof BehaviorReadError &&
                [401, 403].includes(error.status)
              ? "forbidden"
              : "retry",
        );
      } finally {
        if (generation.current === current && !controller.signal.aborted) {
          inFlight.current = false;
          setIsLoading(false);
        }
      }
    },
    [context, entry, clearImpressions],
  );

  const refresh = useCallback(() => requestPage(null, true), [requestPage]);
  useEffect(() => {
    void refresh();
    return () => {
      generation.current++;
      // Cancel the latest append as well as the initial request owned by this generation.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      abort.current?.abort();
      inFlight.current = false;
      clearImpressions();
    };
  }, [refresh, clearImpressions]);

  useEffect(() => {
    const element = sentinel.current;
    if (!element || !cursor || failure || isLoading || owner !== entry) return;
    const observedGeneration = generation.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          generation.current === observedGeneration &&
          !autoPaused.current &&
          entries.some((item) => item.isIntersecting)
        )
          void requestPage(cursor, false);
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [cursor, failure, isLoading, owner, entry, requestPage]);

  if (!session || owner !== entry) return <FeedSkeleton />;
  const message =
    failure === "expired"
      ? "피드 목록이 만료됐어요. 새로고침해 주세요."
      : failure === "forbidden"
        ? "이 피드에 접근할 수 없어요. 프로필과 학원을 확인해 주세요."
        : failure === "cycle"
          ? "다음 목록을 이어볼 수 없어요. 새로고침해 주세요."
          : rows.length
            ? "다음 피드를 불러오지 못했어요."
            : "피드를 불러오지 못했어요.";

  const controls = (
    <div className="flex items-center justify-between px-4 py-2">
      {session.accounts.length > 1 && (
        <select
          aria-label="학원 선택"
          value={session.context.academyId}
          onChange={(event) => session.selectAcademy(event.target.value)}
        >
          {session.accounts.map((account, index) => (
            <option key={account.academyId} value={account.academyId}>
              학원 {index + 1}
            </option>
          ))}
        </select>
      )}
      <button
        type="button"
        className="ml-auto px-3 py-2"
        onClick={() => void refresh()}
        disabled={isLoading && rows.length === 0}
      >
        새로고침
      </button>
    </div>
  );
  if (rows.length === 0 && cursor === null) {
    if (isLoading)
      return (
        <>
          {controls}
          <FeedSkeleton />
        </>
      );
    if (!failure)
      return (
        <>
          {controls}
          <PullToRefresh onRefresh={refresh}>
            <EmptyFeed />
          </PullToRefresh>
        </>
      );
    if (failure === "retry" || failure === "forbidden")
      return (
        <ErrorScreen
          header={
            <>
              <FeedHeader
                academyName={ACADEMY_NAME}
                backHref="/"
                sortLabel=""
              />
              {controls}
            </>
          }
          message={message}
          reset={failure === "retry" ? () => void refresh() : undefined}
        />
      );
  }

  return (
    <div className="flex flex-col">
      <FeedHeader
        academyName={ACADEMY_NAME}
        backHref="/"
        sortLabel={
          sortSource === null
            ? ""
            : sortSource === "RECOMMENDATION"
              ? "추천순"
              : "최신순"
        }
      />
      {controls}
      <PullToRefresh onRefresh={refresh}>
        <ul className="flex flex-col">
          {rows.map(({ card, position, resultContextId, expiresAt }) => {
            const key = `${resultContextId}:${card.sharedCardId}`;
            let impression = impressions.current.get(key);
            if (!impression) {
              impression = new Impression(
                {
                  resultContextId,
                  cardId: card.sharedCardId,
                  position,
                  expiresAt: Date.parse(expiresAt),
                },
                session.entry.queue,
              );
              impressions.current.set(key, impression);
            }
            return (
              <li key={key} data-card-id={card.sharedCardId}>
                <FeedCard
                  card={toFeedCardItem(card)}
                  href={`/feed/${card.ownerId}?academyId=${session.context.academyId}`}
                  impression={impression}
                />
              </li>
            );
          })}
        </ul>
        <div className="px-4 py-6 text-center" aria-live="polite">
          {isLoading && <p role="status">피드를 불러오는 중이에요</p>}
          {failure && (
            <>
              <p role="alert">{message}</p>
              {failure === "retry" && (
                <button
                  type="button"
                  className="mt-3 px-4 py-2"
                  onClick={() =>
                    void requestPage(
                      cursor,
                      rows.length === 0 && cursor === null,
                    )
                  }
                >
                  다시 시도
                </button>
              )}
              {(failure === "expired" || failure === "cycle") && (
                <button
                  type="button"
                  className="mt-3 px-4 py-2"
                  onClick={() => void refresh()}
                >
                  목록 새로 시작
                </button>
              )}
            </>
          )}
          {!isLoading && !failure && cursor === null && (
            <p>
              {rows.length === 0
                ? "아직 공유된 위시가 없어요."
                : "모든 피드를 확인했어요."}
            </p>
          )}
          {!isLoading && !failure && cursor !== null && (
            <button
              type="button"
              onClick={() => void requestPage(cursor, false)}
            >
              더 보기
            </button>
          )}
        </div>
        <div ref={sentinel} aria-hidden="true" className="h-px" />
      </PullToRefresh>
      <TopButton />
    </div>
  );
}
