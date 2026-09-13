"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import laptopImage from "@/../public/images/wishes/loading-laptop.png";
import runImage from "@/../public/images/wishes/loading-run.png";
import searchImage from "@/../public/images/wishes/loading-search.png";

const DURATION_MS = 2400;

/** 기다리는 동안 막대가 다가가는 한계이며, 끝나기 전에는 여기서 멈춥니다. */
const WAITING_CEILING = 0.9;

/** 한계까지 다가가는 속도입니다. 클수록 천천히 찹니다. */
const APPROACH_MS = 900;

/** 기다리던 일이 끝난 뒤 막대를 100%까지 채우는 데 적어도 쓰는 시간입니다. */
const SETTLE_MS = 600;

/** 세 캐릭터가 한 장씩 충분히 보이도록 유지하는 최소 시간입니다. */
const MIN_VISIBLE_MS = 1800;

interface Stage {
  image: StaticImageData;
  width: number;
  height: number;
}

const STAGES: Stage[] = [
  { image: runImage, width: 180, height: 245.455 },
  { image: searchImage, width: 180, height: 251.009 },
  { image: laptopImage, width: 216, height: 253.5 },
];

interface LoadingScreenProps {
  label: string;
  /** 진행 막대가 끝나면 이동할 경로이며, onFinish를 주면 쓰지 않습니다. */
  donePath?: string;
  /** 진행 막대가 끝났을 때 이동 대신 실행할 처리입니다. */
  onFinish?: () => void;
  /**
   * 기다리던 일이 끝났는지입니다.
   *
   * 주면 막대와 캐릭터가 그 일에 맞춰 움직입니다. 기다리는 동안은 한계까지만 차고,
   * 끝나면 100%까지 채운 뒤 마무리합니다. 주지 않으면 정해진 시간 동안만 연출합니다.
   */
  isComplete?: boolean;
}

export function LoadingScreen({
  label,
  donePath,
  onFinish,
  isComplete,
}: LoadingScreenProps) {
  const router = useRouter();
  const [ratio, setRatio] = useState(0);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const isCompleteRef = useRef(isComplete);
  isCompleteRef.current = isComplete;

  useEffect(() => {
    let frame = 0;
    let start = 0;
    let settleStart = 0;
    let settleFrom = 0;
    let settleDuration = SETTLE_MS;

    const finish = () => {
      const handle = onFinishRef.current;
      if (handle !== undefined) {
        handle();
        return;
      }
      if (donePath !== undefined) router.replace(donePath);
    };

    const tick = (now: number) => {
      if (start === 0) start = now;
      const elapsed = now - start;

      if (isCompleteRef.current === undefined) {
        const next = Math.min(1, elapsed / DURATION_MS);
        setRatio(next);
        if (next < 1) {
          frame = requestAnimationFrame(tick);
          return;
        }
        finish();
        return;
      }

      if (!isCompleteRef.current) {
        setRatio(WAITING_CEILING * (1 - Math.exp(-elapsed / APPROACH_MS)));
        frame = requestAnimationFrame(tick);
        return;
      }

      if (settleStart === 0) {
        settleStart = now;
        settleFrom = WAITING_CEILING * (1 - Math.exp(-elapsed / APPROACH_MS));
        settleDuration = Math.max(SETTLE_MS, MIN_VISIBLE_MS - elapsed);
      }

      const settled = Math.min(1, (now - settleStart) / settleDuration);
      setRatio(settleFrom + (1 - settleFrom) * settled);

      if (settled < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      finish();
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [donePath, router]);

  const percent = Math.round(ratio * 100);
  const stage =
    STAGES[Math.min(STAGES.length - 1, Math.floor(ratio * STAGES.length))];

  return (
    <div className="bg-gray-1 relative min-h-dvh overflow-hidden">
      <div className="absolute inset-x-0 top-[125px] flex justify-center">
        <Image
          src={stage.image}
          alt=""
          width={stage.width}
          height={Math.round(stage.height)}
          priority
          style={{ width: stage.width, height: stage.height }}
        />
      </div>

      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        className="bg-pink-3 absolute top-[403px] right-4 left-[17px] h-4 rounded-full"
      >
        <div
          className="bg-pink-6 h-[15px] rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-fg-neutral absolute top-[445px] w-full text-center text-[24px] leading-[29px] font-semibold tracking-[-0.072px]">
        Loading. . .
      </p>
    </div>
  );
}
