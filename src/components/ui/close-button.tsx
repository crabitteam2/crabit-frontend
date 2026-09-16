"use client";

import Image from "next/image";
import closeIcon from "@/../public/images/wishes/close-32.svg";
import { useGoBack } from "@/hooks/use-go-back";

interface CloseButtonProps {
  /** 기록이 없을 때 갈 경로입니다. */
  fallbackHref: string;
  className: string;
}

/** 화면을 닫고 기록의 이전 화면으로 돌아갑니다. */
export function CloseButton({ fallbackHref, className }: CloseButtonProps) {
  const goBack = useGoBack(fallbackHref);

  return (
    <button
      type="button"
      aria-label="닫기"
      onClick={goBack}
      className={className}
    >
      <Image src={closeIcon} alt="" fill sizes="32px" />
    </button>
  );
}
