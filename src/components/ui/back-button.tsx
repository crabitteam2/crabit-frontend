"use client";

import Image from "next/image";
import arrowLeftIcon from "@/../public/images/wishes/arrow-left.svg";
import { useGoBack } from "@/hooks/use-go-back";

interface BackButtonProps {
  /** 기록이 없거나 `usesHref`일 때 갈 경로입니다. */
  fallbackHref: string;
  /**
   * 기록 대신 항상 `fallbackHref`로 갈지 여부입니다.
   *
   * 입력한 값을 주소에 실어 되돌아가는 단계 화면에서 씁니다.
   */
  usesHref?: boolean;
  /** 주면 기록으로 돌아가지 않고 이것을 실행합니다. */
  onBack?: () => void;
  className: string;
}

/** 기록의 이전 화면으로 돌아가며, 기록이 없으면 정해둔 경로로 갑니다. */
export function BackButton({
  fallbackHref,
  usesHref = false,
  onBack,
  className,
}: BackButtonProps) {
  const goBack = useGoBack(fallbackHref, usesHref);

  return (
    <button
      type="button"
      aria-label="뒤로 가기"
      onClick={onBack ?? goBack}
      className={className}
    >
      <Image src={arrowLeftIcon} alt="" fill sizes="32px" />
    </button>
  );
}
