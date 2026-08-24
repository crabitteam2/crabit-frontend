import Image, { type StaticImageData } from "next/image";
import backgroundImage from "@/../public/images/home/character-area-bg.png";
import character1 from "@/../public/images/home/character-1.png";
import character2 from "@/../public/images/home/character-2.png";
import character3 from "@/../public/images/home/character-3.png";
import character4 from "@/../public/images/home/character-4.png";
import type { ProgressStage } from "./progress-stage";

interface CharacterLayout {
  src: StaticImageData;
  frameWidth: number;
  frameTop: number;
  imageSize: number;
  imageLeft: number;
  imageTop: number;
}

const characterByStage: Record<ProgressStage, CharacterLayout> = {
  10: {
    src: character1,
    frameWidth: 271,
    frameTop: 170,
    imageSize: 383,
    imageLeft: -49,
    imageTop: -47,
  },
  30: {
    src: character2,
    frameWidth: 208,
    frameTop: 167,
    imageSize: 315,
    imageLeft: -56,
    imageTop: -17,
  },
  60: {
    src: character3,
    frameWidth: 204,
    frameTop: 163,
    imageSize: 304,
    imageLeft: -58,
    imageTop: -21,
  },
  100: {
    src: character4,
    frameWidth: 199,
    frameTop: 165,
    imageSize: 300,
    imageLeft: -47,
    imageTop: -15,
  },
};

/** 홈 상단 캐릭터 영역의 진행 상태와 전경 콘텐츠입니다. */
interface CharacterAreaProps {
  /** 대표 위시가 없으면 `null`, 있으면 계산된 저축 진행 단계입니다. */
  stage: ProgressStage | null;
  /** 캐릭터 배경 위에 배치할 헤더 등의 전경 콘텐츠입니다. */
  children: React.ReactNode;
}

/** 진행 단계에 맞는 캐릭터와 고정 높이의 홈 상단 배경을 렌더링합니다. */
export function CharacterArea({ stage, children }: CharacterAreaProps) {
  const character = stage === null ? null : characterByStage[stage];

  return (
    <div className="relative h-[439px] w-full overflow-hidden">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        sizes="(max-width: 430px) 100vw, 430px"
        className="object-cover blur-[2.5px]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(51,51,51,0.4)] to-[rgba(51,51,51,0)] to-[59%] blur-[2.5px]" />
      {character ? (
        <div
          className="absolute left-1/2 h-[262px] -translate-x-1/2 overflow-hidden drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
          style={{ width: character.frameWidth, top: character.frameTop }}
        >
          <Image
            src={character.src}
            alt=""
            width={character.imageSize}
            height={character.imageSize}
            priority
            className="absolute max-w-none"
            style={{ left: character.imageLeft, top: character.imageTop }}
          />
        </div>
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
