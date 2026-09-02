"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
}

export function WishEditForm({
  backHref,
  donePath,
  purpose,
  targetAmount,
  period,
}: WishEditFormProps) {
  const router = useRouter();
  const [nextPurpose, setNextPurpose] = useState("");
  const [nextAmount, setNextAmount] = useState("");
  const [range, setRange] = useState(() => fromPeriodLabel(period));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const box = useKeyboardViewport();
  const isKeyboardOpen = box?.isKeyboardOpen ?? false;

  const digits = nextAmount.replace(/\D/g, "");
  const amount = digits === "" ? 0 : Number(digits);
  const nextPeriod = toPeriodLabel(range);
  const canSubmit =
    nextPurpose.trim() !== "" || amount > 0 || nextPeriod !== (period ?? "");

  const submit = () => {
    if (isCalendarOpen) {
      setIsCalendarOpen(false);
      return;
    }

    const params = new URLSearchParams();
    params.set("purpose", nextPurpose === "" ? purpose : nextPurpose);
    params.set("targetAmount", String(amount === 0 ? targetAmount : amount));
    if (nextPeriod !== "") params.set("period", nextPeriod);
    router.push(`${donePath}?${params.toString()}`);
  };

  return (
    <div
      className={
        isKeyboardOpen
          ? "max-w-app fixed inset-x-0 z-10 mx-auto flex w-full flex-col bg-white"
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

      {isCalendarOpen ? null : (
        <>
          <div className="px-4 pt-5 pb-[76px]">
            <Input
              label="위시"
              variant="filled"
              placeholder={purpose}
              value={nextPurpose}
              onChange={(event) => setNextPurpose(event.target.value)}
            />
          </div>

          <div className="px-4 py-5">
            <Input
              label="위시 금액"
              variant="filled"
              inputMode="numeric"
              placeholder={`${targetAmount.toLocaleString("ko-KR")}원`}
              value={digits === "" ? "" : amount.toLocaleString("ko-KR")}
              onChange={(event) => setNextAmount(event.target.value)}
            />
          </div>
        </>
      )}

      <div className={`px-4 py-5 ${isCalendarOpen ? "pt-5" : ""}`}>
        <Input
          label="위시 기간"
          variant="filled"
          readOnly
          value={nextPeriod}
          placeholder="설정된 기간 없음"
          onFocus={() => setIsCalendarOpen(true)}
          onClick={() => setIsCalendarOpen(true)}
        />
      </div>

      {isCalendarOpen ? (
        <div className="px-[10px]">
          <Calendar value={range} onChange={setRange} />
        </div>
      ) : null}

      <div className="flex-1" />

      <div
        className={`px-4 ${isKeyboardOpen ? "pb-5" : "pb-[calc(55px+env(safe-area-inset-bottom))]"}`}
      >
        <Button
          size="xlarge"
          variant={isCalendarOpen ? "weak" : "fill"}
          className="w-full"
          disabled={!isCalendarOpen && !canSubmit}
          onPointerDown={(event) => event.preventDefault()}
          onClick={submit}
        >
          {isCalendarOpen ? "넘어가기" : "다음"}
        </Button>
      </div>
    </div>
  );
}
