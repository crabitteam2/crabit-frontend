import Link from "next/link";
import type { ReactNode } from "react";
import type { components } from "@/lib/http/generated/crabit-backend";

type WeeklyRecap = components["schemas"]["WeeklyRecapResponse"];
type MonthlyRecap = components["schemas"]["MonthlyRecapResponse"];

const CARD_STYLE =
  "flex h-[300px] w-60 shrink-0 flex-col items-start overflow-hidden rounded-[20px] px-4 py-[60px] [filter:drop-shadow(0_2px_2px_rgba(0,0,0,0.15))]";

export interface RecapSectionProps {
  readonly weekly: WeeklyRecap;
  readonly monthly: MonthlyRecap;
}

/** 주간·월간 저축 리포트 미리보기 카드를 가로 스크롤 영역으로 표시합니다. */
export function RecapSection({ weekly, monthly }: RecapSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-t1 text-fg-neutral font-bold">
        리플레이: 저축 리포트
      </h2>
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4">
        <RecapCardLink href={toWeeklyHref(weekly)} label="주간 리플레이">
          <article
            className={`${CARD_STYLE} gap-[68px] bg-[linear-gradient(142deg,var(--color-pink-2)_3%,var(--color-pink-6)_100%)]`}
          >
            <p className="text-t3 text-static-white h-28 shrink-0 px-[10px] font-semibold">
              <span className="block">주간 요약을</span>
              <span className="block">확인하고</span>
              <span className="block">이번 주 계획을</span>
              <span className="block">세워보세요.</span>
            </p>
            <div className="text-static-white w-[178px] shrink-0">
              <p className="px-[10px] text-[14px] leading-[23px] font-semibold tracking-[-0.3px]">
                주간 리플레이
              </p>
              <p className="px-[10px] text-[11px] leading-[23px] tracking-[-0.3px]">
                지난주 동안 내가 가장 많이 한 행동은?
              </p>
            </div>
          </article>
        </RecapCardLink>

        <RecapCardLink href={toMonthlyHref(monthly)} label="월간 리플레이">
          <article
            className={`${CARD_STYLE} gap-11 bg-[linear-gradient(142deg,var(--color-pink-10)_3%,var(--color-pink-6)_100%)]`}
          >
            <p className="text-h1 text-static-white h-10 shrink-0 px-[10px] font-bold">
              Replay
            </p>
            <p className="text-static-white h-10 shrink-0 px-[10px] text-[96px] leading-[40px] font-bold tracking-[-0.3px]">
              {toMonthLabel(monthly)}
            </p>
          </article>
        </RecapCardLink>
      </div>
    </section>
  );
}

function RecapCardLink({
  href,
  label,
  children,
}: {
  href: string | null;
  label: string;
  children: ReactNode;
}) {
  if (href === null) return children;

  return (
    <Link href={href} aria-label={`${label} 보기`} className="shrink-0">
      {children}
    </Link>
  );
}

function toWeeklyHref(recap: WeeklyRecap) {
  return recap.status === "SUCCEEDED" && recap.result !== null
    ? `/recaps/weekly?weekStart=${recap.period.startDate}`
    : null;
}

function toMonthlyHref(recap: MonthlyRecap) {
  return recap.status === "SUCCEEDED" && recap.result !== null
    ? `/recaps/monthly?month=${recap.period.startDate.slice(0, 7)}`
    : null;
}

function toMonthLabel(recap: MonthlyRecap) {
  return `${Number(recap.period.startDate.slice(5, 7))}월`;
}
