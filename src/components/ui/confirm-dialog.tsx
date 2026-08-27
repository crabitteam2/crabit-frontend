"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: ReactNode;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  onDismiss: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onDismiss,
}: ConfirmDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector("button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 flex justify-center">
      <div className="max-w-app relative flex w-full items-center justify-center px-4 pb-[64px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[rgba(42,42,42,0.71)]"
        />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative flex w-full flex-col items-center rounded-[20px] bg-white p-8"
        >
          <p
            id={titleId}
            className="pb-5 text-center text-[24px] leading-[29px] font-bold text-black"
          >
            {title}
          </p>
          <p className="text-fg-neutral-muted pb-5 text-center text-[16px] leading-[23px] font-medium tracking-[-0.048px]">
            {description}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="large" onClick={onPrimary}>
              {primaryLabel}
            </Button>
            <Button size="large" variant="weak" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
