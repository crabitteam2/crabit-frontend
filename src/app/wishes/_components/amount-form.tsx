"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWishForm } from "@/lib/forms/use-wish-form";
import { formEnter } from "@/lib/forms/form-keyboard";
import { amountError, parseKrw, formatKrw } from "@/lib/forms/wish-validation";
import heroImage from "@/../public/images/wishes/deposit-hero.png";
import { PullToRefresh } from "@/app/_components/pull-to-refresh";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKeyboardViewport } from "@/hooks/use-keyboard-viewport";
import { Toast } from "@/components/ui/toast";
import type { FundActionResult } from "../wish-actions";
import { ScreenHeader } from "./screen-header";

interface AmountFormProps {
  title: string;
  backHref: string;
  nextPath: string;
  nextParams?: Record<string, string>;
  max?: number;
  overMessage?: string;
  available: number;
  availableLabel: string;
  remaining?: number;
  from?: string;
  /**
   * 금액을 확정할 때 실행할 서버 액션입니다.
   *
   * 주면 이 화면에서 자금을 옮기고 만들어진 원장 이벤트를 다음 화면에 넘깁니다.
   * 주지 않으면 금액만 들고 다음 화면으로 넘어갑니다.
   */
  action?: (
    amount: number,
    idempotencyKey: string,
  ) => Promise<FundActionResult>;
}

export function AmountForm({
  title,
  backHref,
  nextPath,
  nextParams,
  max,
  overMessage,
  available,
  availableLabel,
  remaining,
  from,
  action,
}: AmountFormProps) {
  const router = useRouter();
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useWishForm({ defaultValues: { amount: "" } });
  const box = useKeyboardViewport();
  const isKeyboardOpen = box?.isKeyboardOpen ?? false;
  const submit = handleSubmit(async ({ amount }) => {
    const value = parseKrw(amount) ?? 0;

    if (action === undefined) {
      const params = new URLSearchParams({
        ...nextParams,
        amount: String(value),
      });
      if (from) params.set("from", from);
      router.push(`${nextPath}?${params}`);
      return;
    }

    setError(null);
    const result = await action(value, idempotencyKey);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    const params = new URLSearchParams({
      ...nextParams,
      event: String(result.eventId),
    });
    router.push(`${nextPath}?${params}`);
  });

  return (
    <form
      noValidate
      onSubmit={submit}
      onKeyDown={formEnter}
      className={
        isKeyboardOpen
          ? "max-w-app fixed inset-x-0 z-10 mx-auto flex w-full flex-col overflow-hidden bg-white [&>header]:shrink-0"
          : "flex min-h-dvh flex-col"
      }
      style={
        isKeyboardOpen && box !== null
          ? { top: box.offsetTop, height: box.height }
          : undefined
      }
    >
      <ScreenHeader title={title} backHref={backHref} spacing="loose" />

      <div
        className={
          isKeyboardOpen ? "min-h-0 flex-1 overflow-y-auto" : undefined
        }
      >
        <PullToRefresh>
          {isKeyboardOpen ? null : (
            <div className="px-4">
              <Image
                src={heroImage}
                alt=""
                width={358}
                height={239}
                priority
                className="h-[239px] w-full rounded-[20px] object-cover"
              />
            </div>
          )}

          <div
            className={`flex flex-col items-start px-4 pb-5 ${isKeyboardOpen ? "pt-5" : "pt-[56px]"}`}
          >
            <Input
              label="금액"
              variant="line-brand"
              {...register("amount", {
                validate: (value) =>
                  amountError(value, available) ??
                  ((max ?? remaining) !== undefined &&
                  (parseKrw(value) ?? 0) > (max ?? remaining)!
                    ? (overMessage ?? "사용 가능한 금액을 넘었어요.")
                    : true),
                onBlur: () =>
                  setValue("amount", formatKrw(getValues("amount"))),
              })}
              type="text"
              inputMode="numeric"
              enterKeyHint="done"
              placeholder="금액을 입력하세요."
              error={errors.amount?.message}
            />
            <span className="text-e1 text-gray-5 py-2">
              {availableLabel} : {available.toLocaleString("ko-KR")}원
            </span>
          </div>
        </PullToRefresh>
      </div>

      {isKeyboardOpen ? null : <div className="flex-1" />}

      <div
        className={`shrink-0 px-4 ${isKeyboardOpen ? "pb-5" : "pb-[calc(55px+env(safe-area-inset-bottom))]"}`}
      >
        <Button
          size="xlarge"
          className="w-full"
          type="submit"
          isLoading={isSubmitting}
          onPointerDown={(event) => event.preventDefault()}
        >
          다음
        </Button>
      </div>

      {error === null ? null : (
        <Toast message={error} tone="danger" onClose={() => setError(null)} />
      )}
    </form>
  );
}
