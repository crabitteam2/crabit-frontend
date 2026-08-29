"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import type { Wish, WishListData } from "@/lib/mock/wishes";
import { EmptyWishCard } from "./empty-wish-card";
import { WishActionSheet } from "./wish-action-sheet";
import { WishCard } from "./wish-card";
import { WISH_TONES } from "./wish-theme";

const FULL_LIST_MAX = 3;

const COLLAPSED_SHOWN = 2;

const MORE_STEP = 2;

function toInitialShown(total: number) {
  return total <= FULL_LIST_MAX ? total : COLLAPSED_SHOWN;
}

const TOAST_MESSAGE = "설정이 저장되었습니다.";

interface WishListProps extends WishListData {
  toastKey?: string | null;
}

export function WishList({
  inProgress,
  finished,
  representativeId,
  toastKey,
}: WishListProps) {
  const [sheetWish, setSheetWish] = useState<Wish | null>(null);
  const [toast, setToast] = useState<string | null>(
    toastKey === null || toastKey === undefined ? null : TOAST_MESSAGE,
  );
  const [inProgressShown, setInProgressShown] = useState(
    toInitialShown(inProgress.length),
  );
  const [finishedShown, setFinishedShown] = useState(
    toInitialShown(finished.length),
  );

  return (
    <>
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
                    onMore={setSheetWish}
                  />
                </li>
              ))}
            </ul>
            {inProgressShown < inProgress.length ? (
              <div className="px-4 pb-5">
                <Button
                  variant="weak"
                  color="dark"
                  size="xlarge"
                  className="w-full"
                  onClick={() => setInProgressShown((n) => n + MORE_STEP)}
                >
                  더보기
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>

      {finished.length === 0 ? null : (
        <>
          <h2 className="text-t1 text-fg-neutral px-4 pt-8 pb-4 font-bold">
            종료된 위시
          </h2>

          <section aria-label="종료된 위시 목록">
            <ul className="flex flex-col gap-10 px-4 pb-10">
              {finished.slice(0, finishedShown).map((wish) => (
                <li key={wish.id}>
                  <WishCard wish={wish} tone="pink" />
                </li>
              ))}
            </ul>
            {finishedShown < finished.length ? (
              <div className="px-4 pb-10">
                <Button
                  variant="weak"
                  color="dark"
                  size="xlarge"
                  className="w-full"
                  onClick={() => setFinishedShown((n) => n + MORE_STEP)}
                >
                  더보기
                </Button>
              </div>
            ) : null}
          </section>
        </>
      )}

      <WishActionSheet wish={sheetWish} onClose={() => setSheetWish(null)} />

      {toast === null ? null : (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}
    </>
  );
}
