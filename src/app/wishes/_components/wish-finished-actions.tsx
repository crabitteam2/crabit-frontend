"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const ACTION_STYLE =
  "inline-flex h-12 flex-1 items-center justify-center rounded-xl px-5 text-[16px] leading-[19px] font-semibold tracking-[-0.3px]";

interface WishFinishedActionsProps {
  wishId: string;
}

export function WishFinishedActions({ wishId }: WishFinishedActionsProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex gap-4 px-4 pt-[22.25px] pb-[6.25px]">
        <button
          type="button"
          className={`bg-brand-solid text-fg-contrast ${ACTION_STYLE}`}
        >
          공유하기
        </button>
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className={`bg-brand-weak text-fg-brand ${ACTION_STYLE}`}
        >
          삭제하기
        </button>
      </div>

      <ConfirmDialog
        isOpen={isDialogOpen}
        title="목표를 정말 삭제할까요?"
        description={
          <>
            지금까지 모은 금액은 카드 잔액으로 돌아가요.
            <br />
            자금 이동 내역에서 계속 확인할 수 있어요.
          </>
        }
        primaryLabel="계속하기"
        secondaryLabel="삭제하기"
        onPrimary={() => setIsDialogOpen(false)}
        onSecondary={() =>
          router.push(`/wishes?deleted=${wishId}&toast=delete`)
        }
        onDismiss={() => setIsDialogOpen(false)}
      />
    </>
  );
}
