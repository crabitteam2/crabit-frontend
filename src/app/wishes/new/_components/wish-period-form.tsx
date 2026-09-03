"use client";

import { useRouter } from "next/navigation";
import { periodError } from "@/lib/forms/wish-validation";
import { useWishForm } from "@/lib/forms/use-wish-form";
import { ScreenHeader } from "@/app/wishes/_components/screen-header";
import { PullToRefresh } from "@/app/_components/pull-to-refresh";
import { Button } from "@/components/ui/button";
import { Calendar, type DateRange } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  toPeriodLabel,
  toPeriodParams,
} from "@/app/wishes/_components/wish-period-format";

const EMPTY_RANGE: DateRange = { start: null, end: null };

interface WishPeriodFormProps {
  backHref: string;
  nextPath: string;
  cardBalanceAccountId: string;
  purpose: string;
  targetAmount: number;
  initialRange?: DateRange;
}

export function WishPeriodForm({
  backHref,
  nextPath,
  cardBalanceAccountId,
  purpose,
  targetAmount,
  initialRange = EMPTY_RANGE,
}: WishPeriodFormProps) {
  const router = useRouter();
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useWishForm({ defaultValues: { range: initialRange } });
  const range = watch("range");

  const hasPeriod = range.start !== null || range.end !== null;

  const submit = handleSubmit(() => {
    const params = toPeriodParams(range);
    params.set("cardBalanceAccountId", cardBalanceAccountId);
    params.set("purpose", purpose);
    params.set("targetAmount", String(targetAmount));
    router.push(`${nextPath}?${params.toString()}`);
  });

  return (
    <form onSubmit={submit} className="flex min-h-svh flex-col">
      <ScreenHeader
        title="기간을 설정할까요?"
        backHref={backHref}
        spacing="loose"
      />

      <PullToRefresh>
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

        <div className="px-4 py-5">
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
            value={toPeriodLabel(range)}
            placeholder="필수로 지정하지 않아도 괜찮아요."
          />
        </div>
      </PullToRefresh>

      <div className="flex-1" />

      <div className="px-4 pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Button
          variant={hasPeriod ? "fill" : "weak"}
          size="xlarge"
          className="w-full"
          type="submit"
          isLoading={isSubmitting}
        >
          {hasPeriod ? "다음" : "넘어가기"}
        </Button>
      </div>
    </form>
  );
}
