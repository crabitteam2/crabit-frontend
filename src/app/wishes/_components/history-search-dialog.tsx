"use client";

import Image from "next/image";
import { useEffect } from "react";
import closeIcon from "@/../public/images/wishes/close-32.svg";
import { Button } from "@/components/ui/button";

export const SEARCH_KINDS = ["잔액 조정", "꺼낸 돈", "넣은 돈"] as const;

/** 모은 돈 기록에서 고를 수 있는 기록 종류입니다. */
export type HistorySearchKind = (typeof SEARCH_KINDS)[number];

interface HistorySearchDialogProps {
  isOpen: boolean;
  /** 지금 고른 종류이며 고른 것이 없으면 null입니다. */
  kind: HistorySearchKind | null;
  /** 종류를 고르면 호출됩니다. */
  onSelect: (kind: HistorySearchKind) => void;
  onClose: () => void;
}

/** 모은 돈 기록을 종류로 찾는 화면입니다. */
export function HistorySearchDialog({
  isOpen,
  kind,
  onSelect,
  onClose,
}: HistorySearchDialogProps) {
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
      aria-label="모은 돈 기록 찾기"
      className="max-w-app fixed inset-0 z-30 mx-auto flex w-full flex-col bg-white"
    >
      <header className="flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
        <h2 className="text-t1 text-fg-neutral font-bold">모은 돈 기록 찾기</h2>
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="relative block size-8 shrink-0"
        >
          <Image src={closeIcon} alt="" fill sizes="32px" />
        </button>
      </header>

      <div className="flex items-center justify-between px-4 py-5">
        {SEARCH_KINDS.map((item) => (
          <Button
            key={item}
            variant={item === kind ? "fill" : "weak"}
            size="large"
            aria-pressed={item === kind}
            onClick={() => onSelect(item)}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
}
