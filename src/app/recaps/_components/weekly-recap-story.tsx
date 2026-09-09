"use client";

import { useRef, useState } from "react";
import { WeeklyRecapFrame } from "./weekly-recap-frame";
import { WeeklyRecapGrowth } from "./weekly-recap-growth";
import { WeeklyRecapSavings } from "./weekly-recap-savings";
import { WeeklyRecapStories } from "./weekly-recap-stories";

const STEP_COUNT = 3;

/** 누르고 있었다고 볼 시간입니다. 이보다 짧으면 장을 넘깁니다. */
const TAP_MS = 250;

/** 짧게 눌렀을 때 이전 장으로 가는 왼쪽 영역의 너비 비율입니다. */
const BACK_RATIO = 1 / 3;

interface WeeklyRecapStoryProps {
  /** 닫기를 눌렀을 때 갈 경로입니다. */
  closeHref: string;
  /** 학원 피드로 갈 경로입니다. */
  feedHref: string;
  savings: Parameters<typeof WeeklyRecapSavings>[0];
  growth: Parameters<typeof WeeklyRecapGrowth>[0];
  stories: Omit<Parameters<typeof WeeklyRecapStories>[0], "feedHref">;
}

/**
 * 주간 리캡 세 장을 차례로 보여줍니다.
 *
 * 한 장이 다 차면 다음 장으로 넘어가고, 화면을 누르고 있으면 멈춥니다.
 * 짧게 누르면 왼쪽은 이전 장, 오른쪽은 다음 장으로 갑니다.
 * 첫 장에서 왼쪽을, 마지막 장에서 오른쪽을 눌러도 넘어가지 않습니다.
 */
export function WeeklyRecapStory({
  closeHref,
  feedHref,
  savings,
  growth,
  stories,
}: WeeklyRecapStoryProps) {
  const [step, setStep] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const pressedAt = useRef(0);

  const isLast = step === STEP_COUNT;

  function goNext() {
    if (isLast) return;
    setStep((current) => current + 1);
  }

  function goBack() {
    setStep((current) => Math.max(1, current - 1));
  }

  function onPointerDown(event: React.PointerEvent) {
    if ((event.target as HTMLElement).closest("a,button") !== null) return;
    pressedAt.current = Date.now();
    setIsPaused(true);
  }

  function onPointerEnd(event: React.PointerEvent) {
    if ((event.target as HTMLElement).closest("a,button") !== null) return;
    setIsPaused(false);
    if (Date.now() - pressedAt.current >= TAP_MS) return;

    const { left, width } = event.currentTarget.getBoundingClientRect();
    if (event.clientX - left < width * BACK_RATIO) goBack();
    else goNext();
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerUp={onPointerEnd}
      onPointerCancel={() => setIsPaused(false)}
    >
      <WeeklyRecapFrame
        step={step}
        stepCount={STEP_COUNT}
        closeHref={closeHref}
        isRunning
        isPaused={isPaused}
        onStepEnd={goNext}
      >
        {step === 1 ? <WeeklyRecapSavings {...savings} /> : null}
        {step === 2 ? <WeeklyRecapGrowth {...growth} /> : null}
        {step === 3 ? (
          <WeeklyRecapStories {...stories} feedHref={feedHref} />
        ) : null}
      </WeeklyRecapFrame>
    </div>
  );
}
