"use client";

import Link from "next/link";
import { useState } from "react";
import { Toast } from "@/components/ui/toast";
import { EmptyWishCard } from "./empty-wish-card";
import { FinishedWishActionSheet } from "./finished-wish-action-sheet";
import { WishActionSheet } from "./wish-action-sheet";
import { WishCard } from "./wish-card";
import type { OwnedWishItem } from "./wish-item";
import { WISH_TONES } from "./wish-theme";

const COLLAPSED_SHOWN = 2;

const MORE_STYLE =
  "bg-neutral-weak text-fg-neutral text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold";

/** 접힌 목록에서 한 묶음이 보여줄 수 있는 카드 수입니다. */
function toShown(total: number, isWhole: boolean) {
  return isWhole ? total : Math.min(total, COLLAPSED_SHOWN);
}

const TOAST_MESSAGES: Record<string, string> = {
  unshared: "학원 피드에서는 이제 보이지 않아요.",
};

const DEFAULT_TOAST_MESSAGE = "설정이 저장되었습니다.";

/** 한 묶음만 전부 보여주는 화면인지, 두 묶음을 접어 보여주는 화면인지 정합니다. */
export type WishListMode = "summary" | "in-progress" | "finished";

interface WishListProps {
  inProgress: OwnedWishItem[];
  finished: OwnedWishItem[];
  representativeId: string | null;
  toastKey?: string | null;
  /** 기본값은 두 묶음을 접어 보여주는 `summary`입니다. */
  mode?: WishListMode;
}

export function WishList({
  inProgress,
  finished,
  representativeId,
  toastKey,
  mode = "summary",
}: WishListProps) {
  const [sheetWish, setSheetWish] = useState<OwnedWishItem | null>(null);
  const [finishedSheetWish, setFinishedSheetWish] =
    useState<OwnedWishItem | null>(null);
  const [toast, setToast] = useState<string | null>(
    toastKey === null || toastKey === undefined
      ? null
      : (TOAST_MESSAGES[toastKey] ?? DEFAULT_TOAST_MESSAGE),
  );
  const showsInProgress = mode !== "finished";
  const showsFinished = mode !== "in-progress";
  const inProgressShown = toShown(inProgress.length, mode === "in-progress");
  const finishedShown = toShown(finished.length, mode === "finished");

  return (
    <>
      {showsInProgress ? (
        <section aria-label="진행중인 위시 목록">
          {inProgress.length === 0 ? (
            <>
              <div className="px-4 pb-5">
                <EmptyWishCard label="진행중인 위시리스트가 없어요." />
              </div>
              <div className="px-4 pb-10">
                <Link
                  href="/wishes/new"
                  className="bg-brand-solid text-fg-contrast text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold"
                >
                  위시리스트 만들기
                </Link>
              </div>
            </>
          ) : (
            <>
              <ul className="flex flex-col gap-10 px-4 pb-10">
                {inProgress.slice(0, inProgressShown).map((wish, index) => (
                  <li key={wish.id}>
                    <WishCard
                      wish={wish}
                      tone={WISH_TONES[index % WISH_TONES.length]}
                      isRepresentative={wish.id === representativeId}
                      onMore={() => setSheetWish(wish)}
                    />
                  </li>
                ))}
              </ul>
              {inProgressShown < inProgress.length ? (
                <div className="px-4 pb-5">
                  <Link href="/wishes/in-progress" className={MORE_STYLE}>
                    더보기
                  </Link>
                </div>
              ) : null}
            </>
          )}
        </section>
      ) : null}

      {!showsFinished || finished.length === 0 ? null : (
        <>
          {mode === "finished" ? null : (
            <h2 className="text-t1 text-fg-neutral px-4 pt-8 pb-4 font-bold">
              종료된 위시
            </h2>
          )}

          <section aria-label="종료된 위시 목록">
            <ul className="flex flex-col gap-10 px-4 pb-10">
              {finished.slice(0, finishedShown).map((wish) => (
                <li key={wish.id}>
                  <WishCard
                    wish={wish}
                    tone="pink"
                    onMore={() => setFinishedSheetWish(wish)}
                  />
                </li>
              ))}
            </ul>
            {finishedShown < finished.length ? (
              <div className="px-4 pb-10">
                <Link href="/wishes/finished" className={MORE_STYLE}>
                  더보기
                </Link>
              </div>
            ) : null}
          </section>
        </>
      )}

      <WishActionSheet wish={sheetWish} onClose={() => setSheetWish(null)} />

      <FinishedWishActionSheet
        wish={finishedSheetWish}
        onClose={() => setFinishedSheetWish(null)}
      />

      {toast === null ? null : (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}
    </>
  );
}
