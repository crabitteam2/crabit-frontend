import type { ReactNode } from "react";

type SkeletonShape = "card" | "control" | "circle";

const shapeStyles: Record<SkeletonShape, string> = {
  card: "rounded-[20px]",
  control: "rounded-xl",
  circle: "rounded-full",
};

/** 조회가 끝날 때까지 자리를 지키는 회색 상자의 모양과 크기입니다. */
export interface SkeletonProps {
  /** 모서리 둥글기입니다. 기본값은 카드와 같은 `card`입니다. */
  shape?: SkeletonShape;
  /** 높이와 너비를 지정하는 클래스입니다. */
  className?: string;
}

/** 조회가 끝날 때까지 자리를 지키는 회색 상자입니다. */
export function Skeleton({ shape = "card", className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-1 animate-pulse ${shapeStyles[shape]} ${className}`}
    />
  );
}

/** 한 화면에서 함께 기다리는 스켈레톤 묶음입니다. */
export interface SkeletonRegionProps {
  /** 낭독기가 읽는 설명이며 무엇을 기다리는지 적습니다. */
  label: string;
  /** 묶음의 배치를 지정하는 클래스입니다. */
  className?: string;
  children: ReactNode;
}

/** 스켈레톤을 묶어 무엇을 불러오는 중인지 낭독기에 알립니다. */
export function SkeletonRegion({
  label,
  className = "",
  children,
}: SkeletonRegionProps) {
  return (
    <div role="status" aria-label={label} className={className}>
      {children}
    </div>
  );
}
