"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
}

export function WishPeriodForm({
  backHref,
  nextPath,
  cardBalanceAccountId,
  purpose,
  targetAmount,
}: WishPeriodFormProps) {
  const router = useRouter();
  const [range, setRange] = useState(EMPTY_RANGE);

  const hasPeriod = range.start !== null;

  const submit = () => {
    const params = toPeriodParams(range);
    params.set("cardBalanceAccountId", cardBalanceAccountId);
    params.set("purpose", purpose);
    params.set("targetAmount", String(targetAmount));
    router.push(`${nextPath}?${params.toString()}`);
  };

  return (
    <div className="flex min-h-svh flex-col">
      <ScreenHeader
        title="기간을 설정할까요?"
        backHref={backHref}
        spacing="loose"
      />

      <PullToRefresh>
        <div className="px-[10px]">
          <Calendar value={range} onChange={setRange} />
        </div>

        <div className="px-4 py-5">
          <Input
            label="위시 기간"
            variant="filled"
            readOnly
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
          onClick={submit}
        >
          {hasPeriod ? "다음" : "넘어가기"}
        </Button>
      </div>
    </div>
  );
}
