import Image from "next/image";
import Link from "next/link";
import { WishProgressBar } from "@/app/wishes/_components/wish-progress-bar";
import type { WishTheme } from "@/app/wishes/_components/wish-theme";
import completedCharacter from "@/../public/images/wishes/share-completed.png";

const CARD_THEME: WishTheme = {
  card: "",
  track: "bg-[#f1f5ff]",
  fill: "bg-[#1948cb]",
  fillsTrack: true,
  highlightsGoal: false,
};

/** 셋째 장에 보여줄 학원 친구의 완주 위시입니다. */
export interface WeeklyRecapStoryCard {
  /** 카드 식별자입니다. */
  readonly id: string;
  /** 위시 주인의 닉네임입니다. */
  readonly nickname: string;
  /** 위시 이름입니다. */
  readonly purpose: string;
  /** `기간:` 뒤에 붙일 저축 기간입니다. */
  readonly period: string;
}

interface WeeklyRecapStoriesProps {
  /** 학원 피드로 갈 경로입니다. */
  feedHref: string;
  /** 완주 소식을 알리는 문구입니다. */
  headline: string;
  /** 누가 무엇을 완주했는지 알리는 문구이며, 없으면 빈 문자열입니다. */
  description: string;
  /** 완주한 위시 카드입니다. */
  cards: readonly WeeklyRecapStoryCard[];
}

/** 학원 친구들의 완주 소식을 보여주는 주간 리캡 셋째 장입니다. */
export function WeeklyRecapStories({
  feedHref,
  headline,
  description,
  cards,
}: WeeklyRecapStoriesProps) {
  return (
    <>
      <div className="flex flex-col gap-4 px-4 pt-5 pb-[45px] tracking-[-0.3px]">
        <p className="text-fg-neutral text-[20px] leading-7 font-medium break-keep whitespace-pre-line">
          {headline}
        </p>
        {description === "" ? null : (
          <p className="text-gray-7 text-[13px] leading-[19px] break-keep whitespace-pre-line">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 px-4 pb-10">
        {cards.map((card) => (
          <article
            key={card.id}
            className="text-fg-neutral h-[186px] overflow-hidden rounded-[20px] bg-[linear-gradient(110.22deg,#cdeffe_3.63%,#618afd_100%)] px-9 pt-7 tracking-[-0.3px]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[20px] leading-7 font-bold">
                  {card.nickname}의 {card.purpose}
                </p>
                <p className="flex h-7 items-center text-[13px] leading-[19px] font-medium">
                  기간: {card.period}
                </p>
              </div>
              <span className="relative block size-[60px] shrink-0 overflow-hidden rounded-full bg-[#f1f5ff]">
                <Image
                  src={completedCharacter}
                  alt=""
                  width={67}
                  height={52}
                  className="absolute top-[5px] left-[-4px] h-[52px] w-[67px] max-w-none object-bottom"
                />
              </span>
            </div>

            <WishProgressBar percent={100} theme={CARD_THEME} />
          </article>
        ))}
      </div>

      <div className="mt-auto px-4 pt-5 pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Link
          href={feedHref}
          className="bg-brand-solid text-fg-contrast flex h-14 items-center justify-center rounded-xl px-6 text-[15px] leading-5 font-semibold tracking-[-0.3px]"
        >
          더 많은 친구들 구경하기
        </Link>
      </div>
    </>
  );
}
