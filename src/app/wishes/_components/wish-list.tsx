"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Toast } from "@/components/ui/toast";
import type { Wish, WishListData } from "@/lib/mock/wishes";
import { EmptyWishCard } from "./empty-wish-card";
import { WishBottomSheet } from "./wish-bottom-sheet";
import { WishCard } from "./wish-card";
import { WISH_TONES } from "./wish-theme";

const PAGE_SIZE = 2;
const SHEET_CLOSE_MS = 300;

type DialogKind = "representative" | "abandon";

interface DialogState {
  wish: Wish;
  kind: DialogKind;
}

type WishListProps = WishListData;

export function WishList({ inProgress, finished }: WishListProps) {
  const router = useRouter();
  const [sheetWish, setSheetWish] = useState<Wish | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [abandonedIds, setAbandonedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [inProgressShown, setInProgressShown] = useState(PAGE_SIZE);
  const [finishedShown, setFinishedShown] = useState(PAGE_SIZE);

  const visibleInProgress = inProgress.filter(
    (wish) => !abandonedIds.includes(wish.id),
  );
  const visibleFinished = [
    ...inProgress
      .filter((wish) => abandonedIds.includes(wish.id))
      .map((wish) => ({ ...wish, state: "ABANDONED" as const })),
    ...finished,
  ];

  const openDialog = (kind: DialogKind) => {
    const wish = sheetWish;
    setSheetWish(null);
    if (wish === null) return;
    setTimeout(() => setDialog({ wish, kind }), SHEET_CLOSE_MS);
  };

  const confirmRepresentative = () => {
    if (dialog === null) return;
    router.push(`/?representative=${dialog.wish.id}&toast=representative`);
  };

  const confirmAbandon = () => {
    if (dialog === null) return;
    setAbandonedIds((ids) => [...ids, dialog.wish.id]);
    setDialog(null);
    setToast("설정이 저장되었습니다.");
  };

  return (
    <>
      <section aria-label="진행중인 위시 목록">
        {visibleInProgress.length === 0 ? (
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
              {visibleInProgress
                .slice(0, inProgressShown)
                .map((wish, index) => (
                  <li key={wish.id}>
                    <WishCard
                      wish={wish}
                      tone={WISH_TONES[index % WISH_TONES.length]}
                      onMore={setSheetWish}
                    />
                  </li>
                ))}
            </ul>
            {inProgressShown < visibleInProgress.length ? (
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

      {visibleFinished.length === 0 ? null : (
        <>
          <h2 className="text-t1 text-fg-neutral px-4 pt-8 pb-4 font-bold">
            종료된 위시
          </h2>

          <section aria-label="종료된 위시 목록">
            <ul className="flex flex-col gap-10 px-4 pb-10">
              {visibleFinished.slice(0, finishedShown).map((wish) => (
                <li key={wish.id}>
                  <WishCard wish={wish} tone="pink" />
                </li>
              ))}
            </ul>
            {finishedShown < visibleFinished.length ? (
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
        infoHref={
          sheetWish === null ? undefined : `/wishes/${sheetWish.id}/info`
        }
        onRepresentative={() => openDialog("representative")}
        onAbandon={() => openDialog("abandon")}
      />

      <ConfirmDialog
        isOpen={dialog?.kind === "representative"}
        title="대표위시로 선택할까요?"
        description={
          <>
            대표 위시로 설정해 보세요.
            <br />홈 화면 가장 상단에서 확인할 수 있어요.
          </>
        }
        primaryLabel="선택하기"
        secondaryLabel="괜찮아요"
        onPrimary={confirmRepresentative}
        onSecondary={() => setDialog(null)}
        onDismiss={() => setDialog(null)}
      />

      <ConfirmDialog
        isOpen={dialog?.kind === "abandon"}
        title="목표를 정말 포기할까요?"
        description={
          <>
            포기하면 종료 위시로 이동하고,
            <br />
            지금까지 모은 금액은 카드 잔액으로 돌아가요.
          </>
        }
        primaryLabel="계속하기"
        secondaryLabel="포기하기"
        onPrimary={() => setDialog(null)}
        onSecondary={confirmAbandon}
        onDismiss={() => setDialog(null)}
      />

      {toast === null ? null : (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}
    </>
  );
}
