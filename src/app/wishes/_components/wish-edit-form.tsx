"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useWishForm } from "@/lib/forms/use-wish-form";
import { formEnter } from "@/lib/forms/form-keyboard";
import {
  purposeError,
  amountError,
  periodError,
  normalizePurpose,
  parseKrw,
  formatKrw,
} from "@/lib/forms/wish-validation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useKeyboardViewport } from "@/hooks/use-keyboard-viewport";
import { createBrowserApiClient } from "@/lib/http/browser";
import type { components } from "@/lib/http/generated/crabit-backend";
import { patchWish } from "@/lib/http/wishes";
import { ScreenHeader } from "./screen-header";
import { fromPeriodLabel, toPeriodLabel } from "./wish-period-format";

interface WishEditFormProps {
  backHref: string;
  donePath: string;
  purpose: string;
  targetAmount: number;
  period: string | null;
  currentAmount?: number;
  cardBalanceAccountId: string;
  wishId: string;
  version: number;
}

export function WishEditForm({
  backHref,
  donePath,
  purpose,
  targetAmount,
  period,
  currentAmount = 0,
  cardBalanceAccountId,
  wishId,
  version,
}: WishEditFormProps) {
  const router = useRouter();
  const [client] = useState(() => createBrowserApiClient());
  const busy = useRef(false);
  const initialRange = fromPeriodLabel(period);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    setFocus,
    formState: { errors },
  } = useWishForm({
    defaultValues: {
      purpose,
      amount: formatKrw(String(targetAmount)),
      range: initialRange,
    },
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const box = useKeyboardViewport();
  const isKeyboardOpen = box?.isKeyboardOpen ?? false;
  const values = watch();
  const range = values.range;
  const nextPeriod = toPeriodLabel(range);
  const isSkippingPeriod = isCalendarOpen && range.start === null;
  const canSubmit =
    !purposeError(values.purpose) &&
    !amountError(values.amount, undefined, currentAmount) &&
    !periodError(range) &&
    (normalizePurpose(values.purpose) !== normalizePurpose(purpose) ||
      parseKrw(values.amount) !== targetAmount ||
      range.start !== initialRange.start ||
      range.end !== initialRange.end);

  const submit = handleSubmit(async (values) => {
    if (!canSubmit || busy.current) return;
    busy.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const body: components["schemas"]["WishMergePatch"] = {
        expectedVersion: version,
        ...(normalizePurpose(values.purpose) === normalizePurpose(purpose)
          ? {}
          : { purpose: normalizePurpose(values.purpose) }),
        ...(parseKrw(values.amount) === targetAmount
          ? {}
          : { targetAmount: parseKrw(values.amount)! }),
        ...(values.range.start === initialRange.start
          ? {}
          : { startDate: values.range.start?.replaceAll(".", "-") ?? null }),
        ...(values.range.end === initialRange.end
          ? {}
          : { targetDate: values.range.end?.replaceAll(".", "-") ?? null }),
      };
      const patched = await patchWish(client, {
        cardBalanceAccountId,
        wishId,
        body,
      });
      if (!patched.ok) {
        setError(
          patched.error.code === "VERSION_CONFLICT"
            ? "다른 곳에서 위시가 변경됐어요. 화면을 새로고침해주세요."
            : "위시를 수정하지 못했어요. 잠시 후 다시 시도해주세요.",
        );
        return;
      }

      router.push(donePath);
    } finally {
      busy.current = false;
      setIsSubmitting(false);
    }
  });

  return (
    <form
      noValidate
      onSubmit={submit}
      onKeyDown={formEnter}
      className={
        isKeyboardOpen
          ? "max-w-app fixed inset-x-0 z-10 mx-auto flex w-full flex-col overflow-hidden bg-white [&>header]:shrink-0"
          : "flex min-h-svh flex-col"
      }
      style={
        isKeyboardOpen && box !== null
          ? { top: box.offsetTop, height: box.height }
          : undefined
      }
    >
      <ScreenHeader
        title="수정할 정보를 입력해주세요."
        backHref={backHref}
        spacing="loose"
      />

      <div
        className={
          isKeyboardOpen ? "min-h-0 flex-1 overflow-y-auto" : undefined
        }
      >
        {isCalendarOpen ? null : (
          <>
            <div className="px-4 pb-[76px]">
              <Input
                label="위시"
                variant="filled"
                {...register("purpose", {
                  validate: (value) => purposeError(value) ?? true,
                })}
                type="text"
                enterKeyHint="next"
                onKeyDown={(event) =>
                  formEnter(event, () => setFocus("amount"))
                }
                error={errors.purpose?.message}
              />
            </div>

            <div className="px-4 py-5">
              <Input
                label="위시 금액"
                variant="filled"
                {...register("amount", {
                  validate: (value) =>
                    amountError(value, undefined, currentAmount) ?? true,
                  onBlur: () =>
                    setValue("amount", formatKrw(getValues("amount"))),
                })}
                type="text"
                inputMode="numeric"
                enterKeyHint="done"
                error={errors.amount?.message}
              />
            </div>
          </>
        )}

        <div className={`px-4 py-5 ${isCalendarOpen ? "pt-5" : ""}`}>
          <Input
            ref={
              register("range", {
                validate: (value) => periodError(value) ?? true,
              }).ref
            }
            error={errors.range?.message}
            label="위시 기간"
            variant="filled"
            readOnly
            inputMode="none"
            value={nextPeriod}
            placeholder="설정된 기간 없음"
            onClick={() => setIsCalendarOpen(true)}
            onKeyDown={(event) =>
              formEnter(event, () => setIsCalendarOpen(true))
            }
          />
        </div>

        {isCalendarOpen ? (
          <div className="px-[10px]">
            <Calendar
              value={range}
              onChange={(range) =>
                setValue("range", range, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>
        ) : null}
      </div>

      {error === null ? null : (
        <p role="alert" className="text-fg-error px-4 pt-4 text-sm">
          {error}
        </p>
      )}

      {isKeyboardOpen ? null : <div className="flex-1" />}

      <div
        className={`shrink-0 px-4 ${isKeyboardOpen ? "pb-5" : "pb-[calc(55px+env(safe-area-inset-bottom))]"}`}
      >
        <Button
          size="xlarge"
          variant={isSkippingPeriod ? "weak" : "fill"}
          className="w-full"
          type={isCalendarOpen ? "button" : "submit"}
          onClick={isCalendarOpen ? () => setIsCalendarOpen(false) : undefined}
          isLoading={isSubmitting}
          disabled={
            !isCalendarOpen &&
            !canSubmit &&
            !purposeError(values.purpose) &&
            !amountError(values.amount, undefined, currentAmount)
          }
          onPointerDown={(event) => event.preventDefault()}
        >
          {isSkippingPeriod ? "넘어가기" : "다음"}
        </Button>
      </div>
    </form>
  );
}
