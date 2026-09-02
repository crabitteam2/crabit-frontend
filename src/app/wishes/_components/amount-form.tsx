"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import heroImage from "@/../public/images/wishes/deposit-hero.png";
import { PullToRefresh } from "@/app/_components/pull-to-refresh";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKeyboardViewport } from "@/hooks/use-keyboard-viewport";
import { ScreenHeader } from "./screen-header";

interface AmountFormProps {
  title: string;
  backHref: string;
  nextPath: string;
  nextParams?: Record<string, string>;
  available: number;
  availableLabel: string;
  max?: number;
  overMessage?: string;
}

const OVER_AVAILABLE_MESSAGE = "사용 가능한 금액을 넘었어요.";

export function AmountForm({
  title,
  backHref,
  nextPath,
  nextParams,
  available,
  availableLabel,
  max,
  overMessage,
}: AmountFormProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const box = useKeyboardViewport();
  const isKeyboardOpen = box?.isKeyboardOpen ?? false;

  const digits = value.replace(/\D/g, "");
  const amount = digits === "" ? 0 : Number(digits);
  const limit = Math.min(available, max ?? available);
  const isOver = amount > limit;
  const canSubmit = amount > 0 && !isOver;

  const error = !isOver
    ? undefined
    : amount > available
      ? OVER_AVAILABLE_MESSAGE
      : (overMessage ?? OVER_AVAILABLE_MESSAGE);

  const submit = () => {
    const query = new URLSearchParams({
      ...nextParams,
      amount: String(amount),
    });
    router.push(`${nextPath}?${query.toString()}`);
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
      <ScreenHeader title={title} backHref={backHref} spacing="loose" />

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
            inputMode="numeric"
            placeholder="금액을 입력하세요."
            value={digits === "" ? "" : amount.toLocaleString("ko-KR")}
            onChange={(event) => setValue(event.target.value)}
            error={error}
          />
          <span className="text-e1 text-gray-5 py-2">
            {availableLabel} : {available.toLocaleString("ko-KR")}원
          </span>
        </div>
      </PullToRefresh>

      <div className="flex-1" />

      <div
        className={`px-4 ${isKeyboardOpen ? "pb-5" : "pb-[calc(55px+env(safe-area-inset-bottom))]"}`}
      >
        <Button
          size="xlarge"
          className="w-full"
          disabled={!canSubmit}
          onPointerDown={(event) => event.preventDefault()}
          onClick={submit}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
