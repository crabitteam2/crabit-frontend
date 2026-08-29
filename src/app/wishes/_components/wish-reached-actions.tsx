"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const ACTION_STYLE =
  "inline-flex h-12 flex-1 items-center justify-center rounded-xl px-5 text-[16px] leading-[19px] font-semibold tracking-[-0.3px]";

interface WishReachedActionsProps {
  wishId: string;
}

export function WishReachedActions({ wishId }: WishReachedActionsProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex gap-4 px-4 pt-[22.25px] pb-[6.25px]">
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className={`bg-brand-solid text-fg-contrast ${ACTION_STYLE}`}
        >
          사용하러 가기
        </button>
        <Link
          href={`/wishes/${wishId}/share`}
          className={`bg-brand-weak text-fg-brand ${ACTION_STYLE}`}
        >
          공유하기
        </Link>
      </div>

      <ConfirmDialog
        isOpen={isDialogOpen}
        title="위시 금액을 모두 모았어요 🎉"
        description={
          <>
            모은 금액을 사용해볼까요?
            <br />
            사용을 선택하면 카드 잔액으로 돌아가고
            <br />
            해당 위시는 종료된 위시에서 확인 할 수 있어요.
          </>
        }
        primaryLabel="사용하기"
        secondaryLabel="미루기"
        onPrimary={() => router.replace("/home?toast=completed")}
        onSecondary={() => setIsDialogOpen(false)}
        onDismiss={() => setIsDialogOpen(false)}
      />
    </>
  );
}
