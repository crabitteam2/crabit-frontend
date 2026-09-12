"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import arrowLeftIcon from "@/../public/images/wishes/arrow-left.svg";

interface BackButtonProps {
  /** 이전 페이지가 없을 때 갈 경로입니다. */
  fallbackHref: string;
  className: string;
}

/** 브라우저 기록의 이전 페이지로 돌아가며, 기록이 없으면 정해둔 경로로 갑니다. */
export function BackButton({ fallbackHref, className }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="뒤로 가기"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }
        router.replace(fallbackHref);
      }}
      className={className}
    >
      <Image src={arrowLeftIcon} alt="" fill sizes="32px" />
    </button>
  );
}
