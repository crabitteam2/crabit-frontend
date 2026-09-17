"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import warningIcon from "@/../public/images/home/shortage-warning.svg";
import { ScreenHeader } from "@/app/wishes/_components/screen-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Toast } from "@/components/ui/toast";
import { FundErrorScreen } from "@/app/wishes/_components/fund-error-screen";
import { useKeyboardViewport } from "@/hooks/use-keyboard-viewport";
import {
  adjustAbandonAction,
  adjustCompleteAction,
  adjustWithdrawAction,
} from "../adjust-actions";
import { AdjustHelpButton } from "./adjust-help-button";
import { putAdjustReceipt } from "./adjust-receipt";

/** 조정 화면에서 돈을 꺼낼 수 있는 위시입니다. */
export interface AdjustWish {
  readonly id: string;
  readonly label: string;
  /** 지금까지 모은 금액입니다. */
  readonly amount: number;
  /** 쓰기 요청에 필요한 위시 스냅샷 버전입니다. */
  readonly version: number;
}

/** 확인 창을 띄운 위시와 그 위시를 종료하는 방법입니다. */
interface ClosingWish {
  readonly wish: AdjustWish;
  readonly intent: "use" | "abandon";
}

interface AdjustWithdrawFormProps {
  /** 카드에 채워야 하는 금액입니다. */
  shortage: number;
  wishes: AdjustWish[];
}

function toAmount(value: string) {
  const digits = value.replace(/\D/gu, "");
  return digits === "" ? 0 : Number(digits);
}

export function AdjustWithdrawForm({
  shortage,
  wishes,
}: AdjustWithdrawFormProps) {
  const router = useRouter();
  const [inputs, setInputs] = useState<Readonly<Record<string, string>>>({});
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [closing, setClosing] = useState<ClosingWish | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const box = useKeyboardViewport();
  const isKeyboardOpen = box?.isKeyboardOpen ?? false;

  const total = wishes.reduce(
    (sum, wish) => sum + toAmount(inputs[wish.id] ?? ""),
    0,
  );
  const isReady = total >= shortage && total > 0;

  const withdraw = async () => {
    if (isPending || !isReady) return;
    setIsPending(true);
    setError(null);

    const picked = wishes
      .map((wish) => ({
        wish,
        amount: toAmount(inputs[wish.id] ?? ""),
      }))
      .filter((item) => item.amount > 0);

    const result = await adjustWithdrawAction(
      picked.map((item) => ({
        wishId: item.wish.id,
        amount: item.amount,
        expectedVersion: item.wish.version,
        idempotencyKey: crypto.randomUUID(),
      })),
    );

    setIsPending(false);
    if (result.message !== null) {
      setError(
        result.withdrawn > 0
          ? `${result.withdrawn.toLocaleString("ko-KR")}원만 꺼내기에 성공했어요. 남은 돈도 꺼내려면 다시 시도해주세요.`
          : result.message,
      );
      return;
    }

    putAdjustReceipt({
      total: result.withdrawn,
      items: picked.map((item) => ({
        label: item.wish.label,
        amount: item.amount,
      })),
    });
    router.replace("/adjust/done");
  };

  const close = async () => {
    if (closing === null || isClosing) return;
    setIsClosing(true);

    const { wish: target, intent } = closing;
    const result =
      intent === "use"
        ? await adjustCompleteAction(target.id, target.version)
        : await adjustAbandonAction(target.id, target.version);
    setIsClosing(false);
    setClosing(null);

    if (result.shortage === null) {
      setError(result.message);
      return;
    }

    if (result.shortage > 0) {
      setToast(
        `${target.amount.toLocaleString("ko-KR")}원이 크래빗 카드로 돌아갔어요.`,
      );
      router.refresh();
      return;
    }

    putAdjustReceipt({
      total: target.amount,
      items: [{ label: target.label, amount: target.amount }],
    });
    router.replace("/adjust/done");
  };

  const label =
    total === 0
      ? "위시를 선택해주세요."
      : total < shortage
        ? `${(shortage - total).toLocaleString("ko-KR")}원이 더 필요해요.`
        : `${total.toLocaleString("ko-KR")}원 꺼내기`;

  if (error !== null) {
    return (
      <FundErrorScreen
        action="잔액 조정"
        reason={error}
        exit={{ href: "/adjust", label: "잔액 조정으로 돌아가기" }}
      />
    );
  }

  return (
    <div
      className={
        isKeyboardOpen
          ? "max-w-app fixed inset-x-0 z-10 mx-auto flex w-full flex-col overflow-hidden bg-white [&>header]:shrink-0"
          : "flex h-dvh flex-col [&>header]:shrink-0"
      }
      style={
        isKeyboardOpen && box !== null
          ? { top: box.offsetTop, height: box.height }
          : undefined
      }
    >
      <ScreenHeader
        title="어떤 위시에서 꺼낼까요?"
        backHref="/"
        action={<AdjustHelpButton />}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <p className="bg-pink-2 text-b2 text-fg-neutral mx-4 mb-10 flex h-[76px] items-center gap-3 rounded-[20px] px-4 font-medium">
          <span aria-hidden="true" className="relative block size-8 shrink-0">
            <Image src={warningIcon} alt="" fill sizes="32px" />
          </span>
          총 {shortage.toLocaleString("ko-KR")}원을 마련해야 해요.
        </p>

        <ul className="px-4 pb-10">
          {wishes.map((wish) => {
            const amount = toAmount(inputs[wish.id] ?? "");
            const isOverAmount = amount > wish.amount;

            return (
              <li
                key={wish.id}
                className="bg-pink-2 mt-10 flex flex-col rounded-[20px] px-9 pt-7 pb-[10px] first:mt-0"
              >
                <p className="text-t3 text-fg-neutral truncate pb-4 font-medium">
                  {wish.label}
                </p>

                <p className="text-e1 text-fg-neutral-muted flex justify-end">
                  현재 모은 금액
                </p>
                <p className="text-fg-neutral flex justify-end pt-2 pb-3 font-bold tracking-[-0.3px]">
                  <span className="text-t3">
                    {wish.amount.toLocaleString("ko-KR")}
                  </span>
                  <span className="text-b1">&nbsp;원</span>
                </p>

                <label className="flex flex-col gap-2">
                  <span className="text-e1 text-fg-neutral-muted">
                    꺼낼 금액
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={inputs[wish.id] ?? ""}
                    onChange={(event) =>
                      setInputs((current) => ({
                        ...current,
                        [wish.id]: event.target.value.replace(/\D/gu, ""),
                      }))
                    }
                    aria-label={`${wish.label}에서 꺼낼 금액`}
                    className="border-gray-1 text-t1 text-pink-6 h-12 rounded-xl border bg-white px-4 font-semibold outline-none"
                  />
                </label>

                <div className="pt-4">
                  <Button
                    variant="fill"
                    size="xlarge"
                    className="w-full"
                    onClick={() => setClosing({ wish, intent: "use" })}
                  >
                    모은 돈을 위시에 사용했어요.
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={() => setClosing({ wish, intent: "abandon" })}
                  className="text-e1 text-fg-neutral-muted py-4 text-center underline"
                >
                  이 위시 포기하기
                </button>

                {amount === 0 ? null : (
                  <p className="text-e1 text-fg-neutral-muted py-2">
                    {isOverAmount
                      ? "위시에 모인 금액보다 많아요."
                      : `꺼낸 후 ${(wish.amount - amount).toLocaleString("ko-KR")}원 남아요.`}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div
        className={`shrink-0 px-4 ${isKeyboardOpen ? "pb-5" : "pb-[calc(55px+env(safe-area-inset-bottom))]"}`}
      >
        <Button
          variant={isReady ? "fill" : "weak"}
          size="xlarge"
          className="w-full"
          aria-disabled={!isReady || undefined}
          isLoading={isPending}
          onClick={() => void withdraw()}
        >
          {label}
        </Button>
      </div>

      <ConfirmDialog
        isOpen={closing?.intent === "use"}
        title="위시 금액을 모두 모았어요 🎉"
        description={
          <>
            올바른 저축 습관을 위해
            <br />
            모은 돈을 실제로 사용한 경우 선택해주세요.
          </>
        }
        primaryLabel="모은 돈을 사용했어요."
        secondaryLabel="아직이에요."
        onPrimary={() => void close()}
        onSecondary={() => setClosing(null)}
        onDismiss={() => setClosing(null)}
        loadingButton={isClosing ? "primary" : undefined}
      />

      <ConfirmDialog
        isOpen={closing?.intent === "abandon"}
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
        onPrimary={() => setClosing(null)}
        onSecondary={() => void close()}
        onDismiss={() => setClosing(null)}
        loadingButton={isClosing ? "secondary" : undefined}
      />

      {toast === null ? null : (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
