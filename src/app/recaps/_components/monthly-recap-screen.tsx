import Image from "next/image";
import Link from "next/link";
import chevronLeftIcon from "@/../public/images/wishes/arrow-left.svg";
import { RecapPattern } from "./recap-pattern";
import { RecapYearSelect } from "./recap-year-select";
import { RecapShape, type RecapShapeKind } from "./recap-shape";
import { getRecapTheme } from "./recap-theme";

const SHAPES: readonly RecapShapeKind[] = ["star", "circle", "cross"];

const CHARACTER_WIDTH = 300;

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
  const characterHeight = Math.round(
    (CHARACTER_WIDTH * theme.character.height) / theme.character.width,
  );

  return (
    <div
      className="relative flex min-h-dvh flex-col overflow-hidden"
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
        <RecapYearSelect year={year} isOnDarkBackground />
      </header>

      <nav
        aria-label="월 선택"
        className="relative flex items-center justify-between px-6 py-5"
      >
        {months.map((month) =>
          month.href === null ? (
            <span
              key={month.label}
              aria-current="page"
              className="text-gray-9 text-[20px] leading-7 font-medium tracking-[-0.3px] whitespace-nowrap"
            >
              {month.label}
            </span>
          ) : (
            <Link
              key={month.label}
              href={month.href}
              className="text-static-white text-[20px] leading-7 font-medium tracking-[-0.3px] whitespace-nowrap"
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

      <div
        className="relative pt-10"
        style={{ paddingBottom: theme.characterBox.bottom }}
      >
        <Image
          src={theme.character}
          alt=""
          width={CHARACTER_WIDTH}
          height={characterHeight}
          className="block"
          style={{ marginLeft: theme.characterBox.left }}
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

/**
 * 도형 하나가 차지하는 자리와 그 안에 그리는 도형의 크기입니다.
 *
 * `frame`은 도형을 돌린 뒤의 바깥 상자라 도형 자체보다 큽니다. 도형은 `art` 크기로 그린 뒤
 * 상자 가운데에서 돌립니다. 별은 그림에 여백이 있어 `inset`으로 안쪽에 앉힙니다.
 */
const PLACEMENTS: Record<
  RecapShapeKind,
  {
    frame: number;
    left: number;
    top: number;
    art: number;
    inset: string;
    rotate: number;
    textRotate: number;
    textWidth: number;
  }
> = {
  star: {
    frame: 398.057,
    left: 50,
    top: 0,
    art: 300,
    inset: "8.4% 10.1% 15.05%",
    rotate: 24.76,
    textRotate: 24.66,
    textWidth: 118,
  },
  circle: {
    frame: 232,
    left: 16,
    top: 332,
    art: 232,
    inset: "0",
    rotate: 0,
    textRotate: 0,
    textWidth: 150,
  },
  cross: {
    frame: 280.516,
    left: 106.879,
    top: 569,
    art: 232,
    inset: "0",
    rotate: 13.76,
    textRotate: 14.03,
    textWidth: 150,
  },
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
      className="absolute"
      style={{
        left: placement.left,
        top: placement.top,
        width: placement.frame,
        height: placement.frame,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative shrink-0"
          style={{
            width: placement.art,
            height: placement.art,
            transform: `rotate(${placement.rotate}deg)`,
          }}
        >
          <div className="absolute" style={{ inset: placement.inset }}>
            <RecapShape kind={kind} fill={fill} className="size-full" />
          </div>
        </div>
      </div>

      <p
        className={`text-fg-neutral absolute top-1/2 left-1/2 text-center tracking-[-0.3px] ${toTextSize(message)}`}
        style={{
          width: placement.textWidth,
          transform: `translate(-50%, -50%) rotate(${placement.textRotate}deg)`,
        }}
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
