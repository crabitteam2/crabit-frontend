"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import laptopImage from "@/../public/images/wishes/loading-laptop.png";
import runImage from "@/../public/images/wishes/loading-run.png";
import searchImage from "@/../public/images/wishes/loading-search.png";

const DURATION_MS = 2400;

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
  donePath: string;
}

export function LoadingScreen({ label, donePath }: LoadingScreenProps) {
  const router = useRouter();
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      if (start === 0) start = now;

      const next = Math.min(1, (now - start) / DURATION_MS);
      setRatio(next);

      if (next < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      router.replace(donePath);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [donePath, router]);

  const percent = Math.round(ratio * 100);
  const stage =
    STAGES[Math.min(STAGES.length - 1, Math.floor(ratio * STAGES.length))];

  return (
    <div className="bg-gray-1 relative min-h-svh overflow-hidden">
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
