import Image from "next/image";
import Link from "next/link";
import chevronLeftIcon from "@/../public/images/wishes/arrow-left.svg";
import chevronRightIcon from "@/../public/images/common/chevron-right.svg";
import { RecapPattern } from "./recap-pattern";
import { RecapShape, type RecapShapeKind } from "./recap-shape";
import { getRecapTheme } from "./recap-theme";

const SHAPES: readonly RecapShapeKind[] = ["star", "circle", "cross"];

/** 월 선택 줄에 그릴 달 하나입니다. */
export interface RecapMonthTab {
  /** 화면에 보여줄 달 이름입니다. */
  readonly label: string;
  /** 이 달을 고를 때 갈 경로이며, 지금 보고 있는 달이면 null입니다. */
  readonly href: string | null;
}

interface MonthlyRecapScreenProps {
  /** 뒤로 가기로 갈 경로입니다. */
  backHref: string;
  /** 화면 오른쪽 위에 보여줄 연도입니다. */
  year: number;
  /** 왼쪽부터 순서대로 그릴 달 목록입니다. */
  months: readonly RecapMonthTab[];
  /** `7월의 아라는` 자리에 넣을 문구입니다. */
  intro: string;
  /** 저축 유형 이름입니다. */
  typeTitle: string;
  /** 유형을 설명하는 문장입니다. */
  typeMessage: string;
  /** 도형 세 개에 순서대로 넣을 문장입니다. */
  highlights: readonly string[];
}

/** 저축 유형과 그달의 성과를 보여주는 월간 리캡 화면입니다. */
export function MonthlyRecapScreen({
  backHref,
  year,
  months,
  intro,
  typeTitle,
  typeMessage,
  highlights,
}: MonthlyRecapScreenProps) {
  const theme = getRecapTheme(typeTitle);

  return (
    <div
      className="relative flex min-h-svh flex-col overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${theme.gradient[0]}, ${theme.gradient[1]})`,
      }}
    >
      <RecapPattern kind={theme.pattern.kind} color={theme.pattern.color} />

      <header className="relative flex items-center justify-between border-b border-white px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
        <Link
          href={backHref}
          aria-label="뒤로 가기"
          className="relative block size-8 shrink-0 brightness-0 invert"
        >
          <Image src={chevronLeftIcon} alt="" fill sizes="32px" />
        </Link>
        <p className="text-static-white flex items-center gap-1 text-[15px] leading-5 font-medium tracking-[-0.3px]">
          {year}
          <span className="relative block size-4 brightness-0 invert">
            <Image src={chevronRightIcon} alt="" fill sizes="16px" />
          </span>
        </p>
      </header>

      <nav
        aria-label="월 선택"
        className="relative flex items-center justify-center gap-12 px-4 py-5"
      >
        {months.map((month) =>
          month.href === null ? (
            <span
              key={month.label}
              aria-current="page"
              className="text-gray-9 text-[20px] leading-7 font-medium tracking-[-0.3px]"
            >
              {month.label}
            </span>
          ) : (
            <Link
              key={month.label}
              href={month.href}
              className="text-static-white text-[20px] leading-7 font-medium tracking-[-0.3px]"
            >
              {month.label}
            </Link>
          ),
        )}
      </nav>

      <div className="relative flex flex-col items-center gap-1 px-4 py-5">
        <p className="text-static-white text-[22px] leading-[30px] font-medium tracking-[-0.3px]">
          {intro}
        </p>
        <h1 className="text-static-white text-[30px] leading-10 font-bold tracking-[-0.3px]">
          {typeTitle}
        </h1>
      </div>

      <div className="relative flex justify-center px-10 pt-10">
        <Image
          src={theme.character}
          alt=""
          width={300}
          height={300}
          className="size-[300px] object-contain"
          priority
        />
      </div>

      <p className="relative mx-4 rounded-[20px] bg-white/20 px-4 py-5 text-center text-[22px] leading-[30px] font-medium tracking-[-0.3px] text-white">
        {typeMessage}
      </p>

      <div className="relative h-[880px] pt-[102px]">
        {highlights.slice(0, SHAPES.length).map((message, index) => (
          <RecapHighlight
            key={message}
            kind={SHAPES[index]!}
            fill={theme.shapes[SHAPES[index]!]}
            message={message}
          />
        ))}
      </div>
    </div>
  );
}

const PLACEMENTS: Record<
  RecapShapeKind,
  { box: number; left: number; top: number; rotate: number; textWidth: number }
> = {
  star: { box: 398, left: 50, top: 0, rotate: 24.76, textWidth: 150 },
  circle: { box: 232, left: 16, top: 332, rotate: 0, textWidth: 150 },
  cross: { box: 280, left: 107, top: 569, rotate: 14.03, textWidth: 170 },
};

function RecapHighlight({
  kind,
  fill,
  message,
}: {
  kind: RecapShapeKind;
  fill: string;
  message: string;
}) {
  const placement = PLACEMENTS[kind];

  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: placement.left,
        top: placement.top,
        width: placement.box,
        height: placement.box,
        transform: `rotate(${placement.rotate}deg)`,
      }}
    >
      <RecapShape kind={kind} fill={fill} className="absolute size-full" />
      <p
        className={`text-fg-neutral relative text-center tracking-[-0.3px] ${toTextSize(message)}`}
        style={{ width: placement.textWidth }}
      >
        {message}
      </p>
    </div>
  );
}

/** 문장이 길수록 글자를 줄여 도형 안에 담습니다. */
function toTextSize(message: string) {
  if (message.length > 44) return "text-[13px] leading-[19px]";
  if (message.length > 30) return "text-[15px] leading-[22px]";
  return "text-[16px] leading-[23px]";
}
