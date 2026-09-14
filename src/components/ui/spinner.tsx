import type { CSSProperties } from "react";

type SpinnerTone = "current" | "brand";

const toneStyles: Record<SpinnerTone, string> = {
  current: "border-2 border-current",
  brand: "border-stroke-brand border-[3px]",
};

/** 그 자리에서 처리가 끝나기를 기다리는 동안 도는 원의 모양입니다. */
export interface SpinnerProps {
  /** 테두리 색이며 기본값은 글자색을 따르는 `current`입니다. */
  tone?: SpinnerTone;
  /** 지름과 위치를 지정하는 클래스입니다. */
  className?: string;
  /** 회전을 멈춘 채 그릴지 여부이며, 당겨서 새로고침이 끌어당기는 동안 씁니다. */
  isPaused?: boolean;
  /** 낭독기가 읽는 설명이며, 주지 않으면 낭독기가 건너뜁니다. */
  label?: string;
  /** 멈춘 동안 회전 각도를 직접 줄 때 씁니다. */
  style?: CSSProperties;
}

/** 버튼과 당겨서 새로고침이 함께 쓰는 스피너입니다. */
export function Spinner({
  tone = "current",
  className = "",
  isPaused = false,
  label,
  style,
}: SpinnerProps) {
  return (
    <span
      role={label === undefined ? undefined : "status"}
      aria-label={label}
      aria-hidden={label === undefined ? "true" : undefined}
      style={style}
      className={`block rounded-full border-t-transparent ${toneStyles[tone]} ${isPaused ? "" : "animate-spin"} ${className}`}
    />
  );
}
