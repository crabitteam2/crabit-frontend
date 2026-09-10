import Image from "next/image";
import emptyCharacter from "@/../public/images/recaps/empty-character.png";
import { WeeklyRecapFrame } from "./weekly-recap-frame";

const MESSAGE = `위시를 만들고, 학원 피드에서
친구들의 활동도 살펴보세요.
기록이 쌓이면 나만의 주간요약이 완성돼요.`;

interface WeeklyRecapEmptyProps {
  /** 닫기를 눌렀을 때 갈 경로입니다. */
  closeHref: string;
}

/** 주간 리캡을 만들 기록이 아직 부족할 때 보여주는 화면입니다. */
export function WeeklyRecapEmpty({ closeHref }: WeeklyRecapEmptyProps) {
  return (
    <WeeklyRecapFrame step={1} stepCount={1} closeHref={closeHref}>
      <div className="flex justify-center px-10 pt-12">
        <Image
          src={emptyCharacter}
          alt=""
          width={310}
          height={310}
          className="size-[310px]"
          priority
        />
      </div>

      <div className="flex flex-col items-center gap-5 px-4 py-5 text-center">
        <p className="text-fg-neutral text-[28px] leading-[34px] font-semibold tracking-[-0.3px]">
          주간요약을 준비하고 있어요!
        </p>
        <p className="text-fg-neutral-muted text-[20px] leading-7 tracking-[-0.3px] whitespace-pre-line">
          {MESSAGE}
        </p>
      </div>
    </WeeklyRecapFrame>
  );
}
