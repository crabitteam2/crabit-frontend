import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import closeIcon from "@/../public/images/wishes/close-32.svg";

const FILL =
  "bg-[linear-gradient(to_right,var(--color-pink-2),var(--color-pink-6))]";

/** 한 장이 다음 장으로 넘어가기까지 걸리는 시간입니다. */
export const STEP_DURATION_MS = 10_000;

interface WeeklyRecapFrameProps {
  /** 지금 보고 있는 장이며 1부터 셉니다. */
  step: number;
  /** 전체 장 수입니다. */
  stepCount: number;
  /** 닫기를 눌렀을 때 갈 경로입니다. */
  closeHref: string;
  /** 보고 있는 칸을 시간에 따라 채울지 여부입니다. */
  isRunning?: boolean;
  /** 채우기를 멈출지 여부이며, 화면을 누르고 있는 동안 멈춥니다. */
  isPaused?: boolean;
  /** 보고 있는 칸이 다 채워졌을 때 부릅니다. */
  onStepEnd?: () => void;
  children: ReactNode;
}

/** 주간 리캡 각 장이 공통으로 쓰는 진행 막대와 닫기 버튼입니다. */
export function WeeklyRecapFrame({
  step,
  stepCount,
  closeHref,
  isRunning = false,
  isPaused = false,
  onStepEnd,
  children,
}: WeeklyRecapFrameProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex items-center gap-1 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
        {Array.from({ length: stepCount }, (_, index) => {
          const isCurrent = index === step - 1;
          if (isRunning && isCurrent) {
            return (
              <span key={index} className="bg-gray-4 h-1 flex-1">
                <span
                  key={step}
                  className={`block h-full ${FILL}`}
                  style={{
                    animation: `recap-step-progress ${STEP_DURATION_MS}ms linear forwards`,
                    animationPlayState: isPaused ? "paused" : "running",
                  }}
                  onAnimationEnd={onStepEnd}
                />
              </span>
            );
          }

          return (
            <span
              key={index}
              className={`h-1 flex-1 ${index < step ? FILL : "bg-gray-4"}`}
            />
          );
        })}
      </div>

      <div className="flex justify-end px-4 py-3">
        <Link
          href={closeHref}
          aria-label="닫기"
          className="relative block size-8 shrink-0"
        >
          <Image src={closeIcon} alt="" fill sizes="32px" />
        </Link>
      </div>

      {children}
    </div>
  );
}
