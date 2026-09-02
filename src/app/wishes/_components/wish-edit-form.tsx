"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { ScreenHeader } from "./screen-header";
import { fromPeriodLabel, toPeriodLabel } from "./wish-period-format";

interface WishEditFormProps {
  backHref: string;
  donePath: string;
  purpose: string;
  targetAmount: number;
  period: string | null;
  currentAmount?: number;
}

export function WishEditForm({
  backHref,
  donePath,
  purpose,
  targetAmount,
  period,
  currentAmount = 0,
}: WishEditFormProps) {
  const router = useRouter();
  const initialRange = fromPeriodLabel(period);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useWishForm({
    defaultValues: {
      purpose,
      amount: formatKrw(String(targetAmount)),
      range: initialRange,
    },
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const box = useKeyboardViewport();
  const isKeyboardOpen = box?.isKeyboardOpen ?? false;
  const values = watch();
  const range = values.range;
  const nextPeriod = toPeriodLabel(range);
  const canSubmit =
    !purposeError(values.purpose) &&
    !amountError(values.amount, undefined, currentAmount) &&
    !periodError(range) &&
    (normalizePurpose(values.purpose) !== normalizePurpose(purpose) ||
      parseKrw(values.amount) !== targetAmount ||
      range.start !== initialRange.start ||
      range.end !== initialRange.end);
  const submit = handleSubmit((values) => {
    if (!canSubmit) return;
    const params = new URLSearchParams({
      purpose: normalizePurpose(values.purpose),
      targetAmount: String(parseKrw(values.amount)),
      startDate: values.range.start?.replaceAll(".", "-") ?? "",
      targetDate: values.range.end?.replaceAll(".", "-") ?? "",
    });
    router.push(`${donePath}?${params}`);
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
            <div className="px-4 pt-5 pb-[76px]">
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

      {isKeyboardOpen ? null : <div className="flex-1" />}

      <div
        className={`shrink-0 px-4 ${isKeyboardOpen ? "pb-5" : "pb-[calc(55px+env(safe-area-inset-bottom))]"}`}
      >
        <Button
          size="xlarge"
          variant={isCalendarOpen ? "weak" : "fill"}
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
          {isCalendarOpen ? "넘어가기" : "다음"}
        </Button>
      </div>
    </form>
  );
}
