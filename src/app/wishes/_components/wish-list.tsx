"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Wish, WishListData } from "@/lib/mock/wishes";
import { EmptyWishCard } from "./empty-wish-card";
import { WishBottomSheet } from "./wish-bottom-sheet";
import { WishCard } from "./wish-card";
import { WISH_TONES } from "./wish-theme";

const PAGE_SIZE = 2;

type WishListProps = WishListData;

export function WishList({ inProgress, finished }: WishListProps) {
  const [sheetWish, setSheetWish] = useState<Wish | null>(null);
  const [inProgressShown, setInProgressShown] = useState(PAGE_SIZE);
  const [finishedShown, setFinishedShown] = useState(PAGE_SIZE);

  return (
    <>
      <section aria-label="진행중인 위시 목록">
        {inProgress.length === 0 ? (
          <>
            <div className="px-4 pb-5">
              <EmptyWishCard label="진행중인 위시리스트가 없어요." />
            </div>
            <div className="px-4 pb-10">
              <Button size="xlarge" className="w-full">
                위시리스트 만들기
              </Button>
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
                  onClick={() => setInProgressShown((n) => n + PAGE_SIZE)}
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
                  onClick={() => setFinishedShown((n) => n + PAGE_SIZE)}
                >
                  더보기
                </Button>
              </div>
            ) : null}
          </section>
        </>
      )}

      <WishBottomSheet
        isOpen={sheetWish !== null}
        onClose={() => setSheetWish(null)}
      />
    </>
  );
}
