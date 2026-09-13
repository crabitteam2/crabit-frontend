"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ScreenHeader } from "@/app/wishes/_components/screen-header";
import { PullToRefresh } from "@/app/_components/pull-to-refresh";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKeyboardViewport } from "@/hooks/use-keyboard-viewport";
import { useWishForm } from "@/lib/forms/use-wish-form";
import { formEnter } from "@/lib/forms/form-keyboard";
import {
  clearFlowMark,
  CREATED_MARK,
} from "@/app/wishes/_components/fund-ticket";
import { toPeriodParams } from "@/app/wishes/_components/wish-period-format";
import type { Period } from "@/lib/forms/wish-validation";
import {
  purposeError,
  amountError,
  normalizePurpose,
  parseKrw,
  formatKrw,
} from "@/lib/forms/wish-validation";

const PURPOSE_FIELD_MIN_HEIGHT = 161;

interface WishGoalFormProps {
  backHref: string;
  nextPath: string;
  available: number | null;
  cardBalanceAccountId: string;
  /** 이전 단계에서 돌아왔을 때 되살릴 위시 이름입니다. */
  initialPurpose?: string;
  /** 이전 단계에서 돌아왔을 때 되살릴 목표 금액입니다. */
  initialAmount?: string;
  /** 이전 단계에서 돌아왔을 때 그대로 들고 갈 기간입니다. */
  initialRange?: Period;
}

export function WishGoalForm({
  backHref,
  nextPath,
  available,
  cardBalanceAccountId,
  initialPurpose = "",
  initialAmount = "",
  initialRange = { start: null, end: null },
}: WishGoalFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useWishForm({
    defaultValues: { purpose: initialPurpose, amount: initialAmount },
  });
  const box = useKeyboardViewport();
  const isKeyboardOpen = box?.isKeyboardOpen ?? false;
  // 첫 단계에 들어오면 새 등록이므로 지난 흐름의 표를 지운다.
  useEffect(() => clearFlowMark(CREATED_MARK), []);

  const submit = handleSubmit(({ purpose, amount }) => {
    const params = toPeriodParams(initialRange);
    params.set("cardBalanceAccountId", cardBalanceAccountId);
    params.set("purpose", normalizePurpose(purpose));
    params.set("targetAmount", String(parseKrw(amount)));
    router.push(`${nextPath}?${params.toString()}`);
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
      <ScreenHeader
        title="위시를 입력해주세요."
        backHref={backHref}
        backToPrevious
        spacing="loose"
      />

      <div
        className={
          isKeyboardOpen ? "min-h-0 flex-1 overflow-y-auto" : undefined
        }
      >
        <PullToRefresh>
          <div
            className="shrink-0 px-4 pt-5"
            style={{ minHeight: PURPOSE_FIELD_MIN_HEIGHT }}
          >
            <Input
              label="위시"
              variant="filled"
              {...register("purpose", {
                validate: (value) => purposeError(value) ?? true,
              })}
              type="text"
              enterKeyHint="next"
              onKeyDown={(event) => formEnter(event, () => setFocus("amount"))}
              error={errors.purpose?.message}
            />
          </div>

          <div className="flex flex-col items-start px-4">
            <Input
              label="위시 금액"
              variant="filled"
              {...register("amount", {
                validate: (value) => amountError(value) ?? true,
                onBlur: () =>
                  setValue("amount", formatKrw(getValues("amount"))),
              })}
              type="text"
              inputMode="numeric"
              enterKeyHint="done"
              error={errors.amount?.message}
            />
            <span className="text-e1 text-gray-5 py-2">
              {available === null
                ? "사용 가능한 금액을 확인해주세요."
                : `현재 사용 가능한 금액 : ${available.toLocaleString("ko-KR")}원`}
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
    </form>
  );
}
