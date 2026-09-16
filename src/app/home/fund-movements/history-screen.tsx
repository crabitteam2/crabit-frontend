"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BackButton } from "@/components/ui/back-button";
import { createBrowserApiClient } from "@/lib/http/browser";
import { listAccountFundMovements } from "@/lib/http/card-balance-accounts";
import searchIcon from "@/../public/images/wishes/search.svg";
import swapIcon from "@/../public/images/wishes/swap.svg";
import { movementPresentation, type FundMovement } from "./history-model";

export function FundMovementHistory({
  accountId,
  initialBounds,
}: {
  accountId: string;
  initialBounds: { from: string; to: string };
}) {
  const [client] = useState(() => createBrowserApiClient());
  const [period, setPeriod] = useState("recent");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [draft, setDraft] = useState("");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<FundMovement[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const generation = useRef(0);
  const loadingMore = useRef(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const from = period === "recent" ? initialBounds.from : undefined;
  const to = period === "recent" ? initialBounds.to : undefined;

  // Invalidate immediately on a condition change, including pending pagination.
  function invalidate() {
    generation.current += 1;
    setItems([]);
    setCursor(null);
    setBusy(true);
    setError(null);
  }

  useEffect(() => {
    const version = ++generation.current;
    setItems([]);
    setCursor(null);
    setBusy(true);
    setError(null);
    loadingMore.current = false;
    if (!accountId) {
      setError(
        "카드 계정을 확인할 수 없어요. 홈에서 카드를 다시 선택해 주세요.",
      );
      setBusy(false);
      return;
    }
    void listAccountFundMovements(client, {
      cardBalanceAccountId: accountId,
      from,
      to,
      q: q || undefined,
      sort,
      limit: 30,
    }).then((result) => {
      if (version !== generation.current) return;
      if (result.ok) {
        setItems(result.data.items);
        setCursor(result.data.nextCursor);
      } else setError("내역을 불러오지 못했어요. 다시 시도해 주세요.");
      setBusy(false);
    });
    return () => {
      generation.current += 1;
    };
  }, [client, accountId, from, to, q, sort, attempt]);

  async function loadMore() {
    if (!cursor || busy || loadingMore.current) return;
    loadingMore.current = true;
    const version = generation.current;
    setBusy(true);
    setError(null);
    const result = await listAccountFundMovements(client, {
      cardBalanceAccountId: accountId,
      from,
      to,
      q: q || undefined,
      sort,
      limit: 30,
      cursor,
    });
    if (version !== generation.current) return;
    loadingMore.current = false;
    if (result.ok) {
      setItems((current) => {
        const seen = new Set(current.map((item) => item.eventId));
        return [
          ...current,
          ...result.data.items.filter((item) => !seen.has(item.eventId)),
        ];
      });
      setCursor(result.data.nextCursor);
    } else setError("다음 내역을 불러오지 못했어요. 다시 시도해 주세요.");
    setBusy(false);
  }

  const groups = new Map<string, FundMovement[]>();
  for (const item of items) {
    const month = movementPresentation(item).month;
    const group = groups.get(month) ?? [];
    group.push(item);
    groups.set(month, group);
  }

  return (
    <main className="bg-layer-default text-fg-neutral min-h-dvh pb-10">
      <header className="relative flex h-16 items-center justify-center px-14">
        <BackButton
          fallbackHref="/home"
          usesHref
          className="absolute left-4 h-8 w-8"
        />
        <h1 className="text-t3 font-semibold">전체 자금 이동 내역</h1>
      </header>
      <div className="px-4 pt-11 pb-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="내역 검색"
            onClick={() => searchInput.current?.focus()}
            className="relative h-8 w-8 shrink-0"
          >
            <Image src={searchIcon} alt="" fill sizes="32px" />
          </button>
          <select
            aria-label="조회 기간"
            value={period}
            onChange={(event) => {
              invalidate();
              setPeriod(event.target.value);
            }}
            className="text-t3 min-w-0 bg-transparent font-medium"
          >
            <option value="recent">최근 3개월</option>
            <option value="all">전체 기간</option>
          </select>
          <select
            aria-label="정렬 순서"
            value={sort}
            onChange={(event) => {
              invalidate();
              setSort(event.target.value as "asc" | "desc");
            }}
            className="text-t3 min-w-0 bg-transparent font-medium"
          >
            <option value="desc">최신순</option>
            <option value="asc">과거순</option>
          </select>
          <Image
            src={swapIcon}
            alt=""
            width={32}
            height={32}
            className="ml-auto shrink-0"
          />
        </div>
        <form
          role="search"
          className="mt-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const next = draft.trim();
            if (q !== next) {
              invalidate();
              setQ(next);
            }
          }}
        >
          <input
            ref={searchInput}
            aria-label="위시 이름, 이동 종류, 금액 검색"
            placeholder="위시 이름, 이동 종류, 금액 검색"
            value={draft}
            onChange={(event) =>
              setDraft(Array.from(event.target.value).slice(0, 100).join(""))
            }
            className="bg-gray-1 text-b4 min-w-0 flex-1 rounded-xl px-3 py-3"
          />
          <button
            className="bg-pink-6 rounded-xl px-3 font-semibold text-white"
            type="submit"
          >
            검색
          </button>
          {q && (
            <button
              type="button"
              aria-label="검색 지우기"
              onClick={() => {
                invalidate();
                setDraft("");
                setQ("");
              }}
              className="text-b4 shrink-0"
            >
              지우기
            </button>
          )}
        </form>
        <p className="text-e2 text-gray-6 mt-3">
          카드 잔액 변경과 위시 자금 이동을 표시해요. 개별 결제 내역은 아니에요.
        </p>
      </div>
      <div aria-live="polite" aria-busy={busy}>
        {[...groups].map(([month, events]) => (
          <section key={month} aria-label={month}>
            <h2 className="text-t3 px-4 py-[9px] font-medium">{month}</h2>
            <ul className="space-y-6 px-4 py-4">
              {events.map((item) => {
                const view = movementPresentation(item);
                return (
                  <li
                    key={item.eventId}
                    className="min-w-0"
                    data-event-id={item.eventId}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <time
                        dateTime={item.occurredAt}
                        className="text-b2 text-gray-9"
                      >
                        {view.date}
                      </time>
                      <p
                        className={`text-b2 text-right font-semibold break-all ${view.increasing ? "text-pink-6" : "text-fg-neutral"}`}
                      >
                        {view.amount}
                      </p>
                    </div>
                    <p className="text-b4 mt-1 font-medium">{view.label}</p>
                    {view.wish && (
                      <p className="text-b4 mt-1 break-all">{view.wish}</p>
                    )}
                    <p className="text-e2 mt-1 text-right">
                      {view.balance}
                      {view.shortage && <> · {view.shortage}</>}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        {!busy && !error && items.length === 0 && (
          <p className="text-b2 px-4 py-16 text-center">
            {q ? "검색 결과가 없어요." : "이 기간의 자금 이동 내역이 없어요."}
          </p>
        )}
        {error && (
          <div role="alert" className="px-4 py-6 text-center">
            <p>{error}</p>
            {accountId && (
              <button
                type="button"
                onClick={() =>
                  cursor ? void loadMore() : setAttempt((value) => value + 1)
                }
                className="mt-3 underline"
              >
                다시 시도
              </button>
            )}
          </div>
        )}
        {busy && (
          <p role="status" className="py-6 text-center">
            내역을 불러오는 중이에요…
          </p>
        )}
        {cursor && !error && (
          <div className="px-4 py-4">
            <button
              type="button"
              disabled={busy}
              onClick={() => void loadMore()}
              className="bg-gray-1 w-full rounded-xl py-4 disabled:opacity-50"
            >
              더 보기
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
