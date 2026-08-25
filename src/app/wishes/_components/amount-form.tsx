"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import heroImage from "@/../public/images/wishes/deposit-hero.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScreenHeader } from "./screen-header";

const KEYBOARD_THRESHOLD = 120;

interface ViewportBox {
  height: number;
  offsetTop: number;
  isKeyboardOpen: boolean;
}

interface AmountFormProps {
  title: string;
  backHref: string;
  nextPath: string;
  available: number;
  availableLabel: string;
}

export function AmountForm({
  title,
  backHref,
  nextPath,
  available,
  availableLabel,
}: AmountFormProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [box, setBox] = useState<ViewportBox | null>(null);
  const tallest = useRef(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (viewport === null) return;

    const sync = () => {
      tallest.current = Math.max(tallest.current, viewport.height);
      setBox({
        height: viewport.height,
        offsetTop: viewport.offsetTop,
        isKeyboardOpen: tallest.current - viewport.height > KEYBOARD_THRESHOLD,
      });
    };

    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
    };
  }, []);

  const isKeyboardOpen = box?.isKeyboardOpen ?? false;

  useEffect(() => {
    if (!isKeyboardOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isKeyboardOpen]);

  const digits = value.replace(/\D/g, "");
  const amount = digits === "" ? 0 : Number(digits);
  const isOver = amount > available;
  const canSubmit = amount > 0 && !isOver;

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
          placeholder="입력하세요"
          value={digits === "" ? "" : amount.toLocaleString("ko-KR")}
          onChange={(event) => setValue(event.target.value)}
          error={isOver ? "사용 가능한 금액을 넘었어요." : undefined}
        />
        <span className="text-e1 text-gray-5 py-2">
          {availableLabel} : {available.toLocaleString("ko-KR")}원
        </span>
      </div>

      <div className="flex-1" />

      <div
        className={`px-4 ${isKeyboardOpen ? "pb-5" : "pb-[calc(55px+env(safe-area-inset-bottom))]"}`}
      >
        <Button
          size="xlarge"
          className="w-full"
          disabled={!canSubmit}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => router.push(`${nextPath}?amount=${amount}`)}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
