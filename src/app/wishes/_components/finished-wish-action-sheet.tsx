"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Toast } from "@/components/ui/toast";
import { deleteWishAction } from "../wish-actions";
import type { OwnedWishItem } from "./wish-item";

const SHEET_CLOSE_MS = 300;

const ACTION_STYLE =
  "text-t3 text-fg-neutral flex w-full items-start pb-11 text-left font-medium";

interface FinishedWishActionSheetProps {
  wish: OwnedWishItem | null;
  onClose: () => void;
}

/** 종료된 위시의 더보기 시트이며 공유와 삭제를 제공합니다. */
export function FinishedWishActionSheet({
  wish,
  onClose,
}: FinishedWishActionSheetProps) {
  const router = useRouter();
  const [target, setTarget] = useState<OwnedWishItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = () => {
    const opened = wish;
    onClose();
    if (opened === null) return;
    setTimeout(() => setTarget(opened), SHEET_CLOSE_MS);
  };

  const remove = async () => {
    if (target === null || isDeleting) return;
    setIsDeleting(true);

    const result = await deleteWishAction(target.id, target.version);
    setIsDeleting(false);
    setTarget(null);

    if (result.ok) {
      router.replace("/wishes?toast=delete");
      return;
    }
    setError(result.message);
  };

  const dismiss = () => {
    if (isDeleting) return;
    setTarget(null);
  };

  return (
    <>
      <BottomSheet
        isOpen={wish !== null}
        onClose={onClose}
        title="위시 기록 내역"
      >
        {wish === null ? null : (
          <>
            {wish.visibility === "PRIVATE" ? (
              <Link href={`/wishes/${wish.id}/share`} className={ACTION_STYLE}>
                학원 피드 공유하기
              </Link>
            ) : (
              <Link
                href={`/wishes/${wish.id}/share/write`}
                className={ACTION_STYLE}
              >
                학원 피드 공개 대상 수정
              </Link>
            )}
            <button type="button" onClick={openDialog} className={ACTION_STYLE}>
              삭제하기
            </button>
          </>
        )}
      </BottomSheet>

      <ConfirmDialog
        isOpen={target !== null}
        title="위시를 정말 삭제할까요?"
        description="삭제한 위시는 다시 복구할 수 없어요."
        primaryLabel="아니요"
        secondaryLabel="삭제하기"
        onPrimary={dismiss}
        onSecondary={() => void remove()}
        onDismiss={dismiss}
        loadingButton={isDeleting ? "secondary" : undefined}
      />

      {error === null ? null : (
        <Toast message={error} tone="danger" onClose={() => setError(null)} />
      )}
    </>
  );
}
