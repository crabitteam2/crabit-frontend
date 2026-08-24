"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import closeIcon from "@/../public/images/wishes/close.svg";

const ACTIONS = [
  "정보 수정",
  "대표 위시 설정",
  "목표 포기",
  "학원 피드 올리기",
] as const;

const TRANSITION_MS = 300;

interface WishBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishBottomSheet({ isOpen, onClose }: WishBottomSheetProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isRaised, setIsRaised] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      return;
    }

    setIsRaised(false);
    const timer = setTimeout(() => setIsMounted(false), TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isMounted || !isOpen) return;

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setIsRaised(true));
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [isMounted, isOpen]);

  useEffect(() => {
    if (!isMounted) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus();
    };
  }, [isMounted, onClose]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-20 flex justify-center">
      <div className="max-w-app relative flex w-full flex-col">
        <button
          type="button"
          aria-label="닫기"
          tabIndex={-1}
          onClick={onClose}
          className={`absolute inset-0 bg-[rgba(42,42,42,0.71)] transition-opacity duration-300 motion-reduce:transition-none ${
            isRaised ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`pb-safe relative mt-auto flex w-full flex-col items-center rounded-t-[20px] bg-white px-4 pt-2 transition-transform duration-300 ease-out motion-reduce:transition-none ${
            isRaised ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <span
            aria-hidden="true"
            className="h-[6px] w-[49px] shrink-0 rounded-[9px] bg-[#d9d9d9]"
          />
          <div className="flex w-full items-center justify-between pt-6 pb-11">
            <h2
              id={titleId}
              className="text-t1 text-fg-neutral font-bold whitespace-nowrap"
            >
              저축 기록 내역
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="시트 닫기"
              className="relative block size-8 shrink-0"
            >
              <Image src={closeIcon} alt="" fill sizes="32px" />
            </button>
          </div>
          {ACTIONS.map((action) => (
            <button
              key={action}
              type="button"
              className="text-t3 text-fg-neutral flex w-full items-start pb-11 text-left font-medium"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
