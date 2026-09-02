"use client";
import { useEffect, useRef, useState } from "react";
import { FeedHeader } from "./feed-header";
import { Impression } from "@/lib/behavior/collector";
import type { components } from "@/lib/http/generated/crabit-backend";
import { useBehaviorSession, behaviorRead } from "./behavior-session";
import { SharedCard } from "./shared-card";
type Page = components["schemas"]["FeedResultResponse"];
export function RealFeed() {
  const session = useBehaviorSession();
  const [pages, setPages] = useState<Page[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const version = useRef(0);
  const impressions = useRef(new Map<string, Impression>());
  const load = async (cursor?: string) => {
    if (!session) return;
    const current = ++version.current;
    setBusy(true);
    setError(false);
    if (!cursor) {
      session.entry.queue.discardPending();
      for (const value of impressions.current.values()) value.end();
      impressions.current.clear();
      setPages([]);
    }
    try {
      const page = await behaviorRead<Page>(session.context, "feed-results", {
        method: "POST",
        body: JSON.stringify({ limit: 20, ...(cursor ? { cursor } : {}) }),
      });
      if (version.current === current)
        setPages((previous) => (cursor ? [...previous, page] : [page]));
    } catch {
      if (version.current === current) setError(true);
    } finally {
      if (version.current === current) setBusy(false);
    }
  };
  useEffect(() => {
    void load();
    return () => {
      version.current++;
      for (const value of impressions.current.values()) value.end();
      impressions.current.clear();
    };
  }, [session?.entry]);
  if (!session) return null;
  const academies = [...new Set(session.accounts.map((x) => x.academyId))];
  return (
    <div>
      <FeedHeader academyName="학원 피드" backHref="/" sortLabel="최신순" />
      <div className="flex justify-end px-4 py-2">
        <button disabled={busy} onClick={() => void load()}>
          새로고침
        </button>
      </div>
      {academies.length > 1 && (
        <label className="p-4">
          학원 선택{" "}
          <select
            value={session.context.academyId}
            onChange={(event) => session.selectAcademy(event.target.value)}
          >
            {academies.map((id, index) => (
              <option key={id} value={id}>
                학원 {index + 1}
              </option>
            ))}
          </select>
        </label>
      )}
      {error && (
        <p role="alert" className="p-4">
          피드를 불러오지 못했어요. 다시 시도해 주세요.
        </p>
      )}
      {pages.map((page) => (
        <div key={page.resultContextId}>
          {page.items.map((card, position) => {
            const key = `${page.resultContextId}:${card.sharedCardId}:${position}`;
            let impression = impressions.current.get(key);
            if (!impression) {
              impression = new Impression(
                {
                  resultContextId: page.resultContextId,
                  cardId: card.sharedCardId,
                  position,
                  expiresAt: Date.parse(page.expiresAt),
                },
                session.entry.queue,
              );
              impressions.current.set(key, impression);
            }
            return (
              <SharedCard
                key={key}
                card={card}
                impression={impression}
                academyId={session.context.academyId}
              />
            );
          })}
        </div>
      ))}
      {!busy &&
        !error &&
        pages.length > 0 &&
        pages.every((page) => !page.items.length) && (
          <p className="p-6">아직 공유된 위시가 없어요.</p>
        )}
      {busy && (
        <p role="status" className="p-6">
          불러오는 중이에요.
        </p>
      )}
      {pages.at(-1)?.nextCursor && (
        <button
          className="w-full p-5"
          disabled={busy}
          onClick={() => void load(pages.at(-1)!.nextCursor!)}
        >
          더 보기
        </button>
      )}
    </div>
  );
}
