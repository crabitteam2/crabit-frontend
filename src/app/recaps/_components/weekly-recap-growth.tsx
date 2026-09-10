import Image from "next/image";
import growthCharacter from "@/../public/images/recaps/growth-character.png";

interface WeeklyRecapGrowthProps {
  /** 조회수 성장을 알리는 문구입니다. */
  headline: string;
  /** 조회수를 풀어서 설명하는 문구이며, 없으면 빈 문자열입니다. */
  description: string;
  /** 카드 제목에 넣을 닉네임입니다. */
  nickname: string;
  /** 지난주에 내 위시리스트를 본 횟수입니다. */
  totalVisits: number;
  /** 지난주 대비 인기 변화율이며, 비교할 수 없으면 null입니다. */
  growthPct: number | null;
}

/** 위시리스트 조회 성장을 보여주는 주간 리캡 둘째 장입니다. */
export function WeeklyRecapGrowth({
  headline,
  description,
  nickname,
  totalVisits,
  growthPct,
}: WeeklyRecapGrowthProps) {
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

      <div className="px-4 pb-[60px]">
        <div className="text-fg-neutral relative h-[273px] overflow-hidden rounded-[20px] bg-[linear-gradient(189.19deg,var(--color-pink-4)_8.75%,var(--layer-fill)_91.25%)] tracking-[-0.3px]">
          <p className="absolute top-7 left-9 text-[20px] leading-7 font-bold">
            {nickname}의 위시리스트
          </p>

          <p className="absolute top-[93px] left-9 text-[16px] leading-[23px] font-medium">
            지난주 방문 횟수
          </p>
          <p className="absolute top-[121px] left-9 text-[30px] leading-10 font-bold">
            {totalVisits} 회
          </p>

          <p className="absolute top-[177px] left-9 text-[16px] leading-[23px] font-medium">
            지난주 대비 인기
          </p>
          <p className="absolute top-[205px] left-9 text-[30px] leading-10 font-bold">
            {growthPct ?? 0}% 증가
          </p>

          <div className="absolute bottom-0 left-[179px] h-[154px] w-[186px] overflow-hidden">
            <Image
              src={growthCharacter}
              alt=""
              width={186}
              height={186}
              className="absolute top-[-10px] left-0 h-[186px] w-[186px] max-w-none"
            />
          </div>
        </div>
      </div>
    </>
  );
}
