"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScreenHeader } from "@/app/wishes/_components/screen-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKeyboardViewport } from "@/hooks/use-keyboard-viewport";
import {
  isValidPurpose,
  isValidTargetAmount,
  normalizePurpose,
  stripAmountSeparators,
  toTargetAmount,
} from "./wish-goal-validation";

const FORMAT_ERROR = "올바른 형식이 아니에요";
const PURPOSE_FIELD_HEIGHT = 161;

interface WishGoalFormProps {
  backHref: string;
  nextPath: string;
  available: number;
}

function formatAmount(value: string) {
  const digits = stripAmountSeparators(value);
  if (!/^\d+$/.test(digits)) return value;
  return Number(digits).toLocaleString("ko-KR");
}

export function WishGoalForm({
  backHref,
  nextPath,
  available,
}: WishGoalFormProps) {
  const router = useRouter();
  const [purpose, setPurpose] = useState("");
  const [amountValue, setAmountValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const box = useKeyboardViewport();
  const isKeyboardOpen = box?.isKeyboardOpen ?? false;

  const isPurposeValid = isValidPurpose(purpose);
  const isAmountValid = isValidTargetAmount(amountValue);
  const hasPurposeError = isSubmitted && !isPurposeValid;
  const hasAmountError = isSubmitted && !isAmountValid;
  const isIncomplete = purpose === "" || amountValue === "";

  const submit = () => {
    setIsSubmitted(true);
    if (!isPurposeValid || !isAmountValid) return;

    const params = new URLSearchParams({
      purpose: normalizePurpose(purpose),
      targetAmount: String(toTargetAmount(amountValue)),
    });
    router.push(`${nextPath}?${params.toString()}`);
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
        title="목표를 입력해주세요."
        backHref={backHref}
        spacing="loose"
      />

      <div
        className="shrink-0 px-4 pt-5"
        style={{ height: PURPOSE_FIELD_HEIGHT }}
      >
        <Input
          label="목표"
          variant="filled"
          placeholder="텍스트 작성"
          value={purpose}
          error={hasPurposeError ? FORMAT_ERROR : undefined}
          onChange={(event) => setPurpose(event.target.value)}
        />
      </div>

      <div className="flex flex-col items-start px-4">
        <Input
          label="목표 금액"
          variant="filled"
          inputMode="decimal"
          value={formatAmount(amountValue)}
          error={hasAmountError ? FORMAT_ERROR : undefined}
          onChange={(event) =>
            setAmountValue(stripAmountSeparators(event.target.value))
          }
        />
        <span className="text-e1 text-gray-5 py-2">
          현재 사용 가능한 금액 : {available.toLocaleString("ko-KR")}원
        </span>
      </div>

      <div className="flex-1" />

      <div
        className={`px-4 ${isKeyboardOpen ? "pb-5" : "pb-[calc(55px+env(safe-area-inset-bottom))]"}`}
      >
        <Button
          size="xlarge"
          className="w-full"
          disabled={isIncomplete}
          onPointerDown={(event) => event.preventDefault()}
          onClick={submit}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
