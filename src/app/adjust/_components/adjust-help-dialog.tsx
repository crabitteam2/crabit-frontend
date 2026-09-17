"use client";

import Image from "next/image";
import { useEffect } from "react";
import closeIcon from "@/../public/images/wishes/close-32.svg";

const SECTIONS = [
  {
    title: "1. 하나의 위시에서 모두 꺼내기",
    lines: [
      "하나의 위시에 모은 돈이 충분하다면,",
      "그 위시에서 꺼낼 필요한 금액을 모두 입력해요.",
      "",
      "예) 20,000원이 필요하면",
      "하나의 위시에 20,000원 꺼내기",
    ],
  },
  {
    title: "2. 여러 위시에서 나누어 꺼내기",
    lines: [
      "여러 위시에서 나누어 꺼낼 수 있어요.",
      "",
      "예) 첫 번째 위시 15,000원",
      "두 번째 위시 5,000원",
    ],
  },
  {
    title: "3. 위시를 포기하고 모두 꺼내기",
    lines: [
      "이 위시 포기하기를 눌러요.",
      "그 위시에 모은 돈이 모두 카드로 돌아와요.",
      "",
      "그래도 카드 잔액이 부족하면,",
      "다른 위시에서 남은 금액을 더 꺼내야 해요.",
    ],
  },
  {
    title: "4. 모은 돈을 위시에 사용했어요",
    lines: [
      "목표를 다 모아서 실제로 사용했다면 눌러요.",
      "위시가 완료로 끝나고 모은 돈이 모두 카드로 돌아와요.",
    ],
  },
] as const;

interface AdjustHelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/** 카드 잔액을 맞추는 방법을 알려주는 창입니다. */
export function AdjustHelpDialog({ isOpen, onClose }: AdjustHelpDialogProps) {
  useEffect(() => {
    if (!isOpen) return;

    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="카드 잔액은 이렇게 맞춰요"
      className="fixed inset-0 z-30 flex justify-center overflow-y-auto bg-[rgba(42,42,42,0.71)] px-4 py-10"
    >
      <div className="h-fit w-full max-w-[358px] rounded-[20px] bg-white p-8">
        <div className="flex items-center justify-between pb-5">
          <h2 className="text-fg-neutral text-[24px] font-bold">
            카드 잔액은 이렇게 맞춰요
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="relative block size-6 shrink-0"
          >
            <Image src={closeIcon} alt="" fill sizes="24px" />
          </button>
        </div>

        <p className="text-fg-neutral-muted pb-10 text-[16px] leading-[23px] font-medium tracking-[-0.048px]">
          카드에 부족한만큼 위시에서 돈을 꺼내야 해요.
          <br />
          아래 중 나에게 맞는 방법을 선택해 보세요.
        </p>

        {SECTIONS.map((section, index) => (
          <div
            key={section.title}
            className={index === SECTIONS.length - 1 ? "" : "pb-10"}
          >
            <h3 className="text-pink-6 pb-2 text-[24px] font-bold">
              {section.title}
            </h3>
            <p className="text-fg-neutral-muted text-[16px] leading-[23px] font-medium tracking-[-0.048px]">
              {section.lines.map((line, lineIndex) => (
                <span key={`${section.title}-${lineIndex}`}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
