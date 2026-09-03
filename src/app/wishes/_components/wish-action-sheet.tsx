"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Toast } from "@/components/ui/toast";
import {
  abandonWishAction,
  selectRepresentativeWishAction,
  type WishActionResult,
} from "../wish-actions";
import type { OwnedWishItem } from "./wish-item";

const SHEET_CLOSE_MS = 300;

const ACTION_STYLE =
  "text-t3 text-fg-neutral flex w-full items-start pb-11 text-left font-medium";

type DialogKind = "representative" | "abandon";

interface PendingDialog {
  wish: OwnedWishItem;
  kind: DialogKind;
}

interface WishActionSheetProps {
  wish: OwnedWishItem | null;
  onClose: () => void;
}

export function WishActionSheet({ wish, onClose }: WishActionSheetProps) {
  const router = useRouter();
  const [dialog, setDialog] = useState<PendingDialog | null>(null);
  const [pending, setPending] = useState<DialogKind | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openDialog = (kind: DialogKind) => {
    const opened = wish;
    onClose();
    if (opened === null) return;
    setTimeout(() => setDialog({ wish: opened, kind }), SHEET_CLOSE_MS);
  };

  const confirm = async (
    request: (target: OwnedWishItem) => Promise<WishActionResult>,
    toHref: (target: OwnedWishItem) => string,
  ) => {
    if (dialog === null || pending !== null) return;
    const target = dialog.wish;
    setPending(dialog.kind);

    const result = await request(target);
    setPending(null);
    setDialog(null);

    if (result.ok) {
      router.push(toHref(target));
      return;
    }
    setError(result.message);
  };

  const dismiss = () => {
    if (pending !== null) return;
    setDialog(null);
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
            <Link href={`/wishes/${wish.id}/info`} className={ACTION_STYLE}>
              정보 수정
            </Link>
            <button
              type="button"
              onClick={() => openDialog("representative")}
              className={ACTION_STYLE}
            >
              대표 위시 설정
            </button>
            <button
              type="button"
              onClick={() => openDialog("abandon")}
              className={ACTION_STYLE}
            >
              위시 포기
            </button>
            <Link href={`/wishes/${wish.id}/share`} className={ACTION_STYLE}>
              학원 피드 올리기
            </Link>
          </>
        )}
      </BottomSheet>

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
        onPrimary={() =>
          void confirm(
            (target) => selectRepresentativeWishAction(target.id),
            () => "/?toast=representative",
          )
        }
        onSecondary={dismiss}
        onDismiss={dismiss}
        loadingButton={pending === "representative" ? "primary" : undefined}
      />

      <ConfirmDialog
        isOpen={dialog?.kind === "abandon"}
        title="위시를 정말 포기할까요?"
        description={
          <>
            포기하면 종료 위시로 이동하고,
            <br />
            지금까지 모은 금액은 카드 잔액으로 돌아가요.
          </>
        }
        primaryLabel="아니요"
        secondaryLabel="포기하기"
        onPrimary={dismiss}
        onSecondary={() =>
          void confirm(
            (target) => abandonWishAction(target.id, target.version),
            () => "/wishes?toast=abandon",
          )
        }
        onDismiss={dismiss}
        loadingButton={pending === "abandon" ? "secondary" : undefined}
      />

      {error === null ? null : (
        <Toast message={error} tone="danger" onClose={() => setError(null)} />
      )}
    </>
  );
}
