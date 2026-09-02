"use client";

import Image from "next/image";
import { useEffect } from "react";
import dangerIcon from "@/../public/images/common/toast-danger.svg";
import successIcon from "@/../public/images/common/toast-success.svg";

const AUTO_HIDE_MS = 3000;

export type ToastTone = "success" | "danger";

interface ToastProps {
  message: string;
  tone?: ToastTone;
  onClose: () => void;
}

export function Toast({ message, tone = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="pt-safe max-w-app fixed inset-x-0 top-0 z-30 mx-auto px-[15px]">
      <p
        role="status"
        className="flex h-[60px] items-center gap-3 rounded-full bg-[rgba(81,82,91,0.92)] px-5 text-[13px] leading-[19px] font-bold tracking-[-0.3px] text-white"
      >
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center"
        >
          <Image
            src={tone === "danger" ? dangerIcon : successIcon}
            alt=""
            width={20}
            height={20}
            className="size-5"
          />
        </span>
        {message}
      </p>
    </div>
  );
}
