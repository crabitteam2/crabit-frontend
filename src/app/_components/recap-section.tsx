import Link from "next/link";
import type { components } from "@/lib/http/generated/crabit-backend";

type WeeklyRecap = components["schemas"]["WeeklyRecapResponse"];
type MonthlyRecap = components["schemas"]["MonthlyRecapResponse"];

export interface RecapSectionProps {
  readonly weekly: WeeklyRecap;
  readonly monthly: MonthlyRecap;
}

/** 저장된 주간·월간 리캡 상태를 실제 조회 결과 그대로 표시합니다. */
export function RecapSection({ weekly, monthly }: RecapSectionProps) {
  return (
    <section className="flex flex-col gap-2" aria-labelledby="recap-heading">
      <h2 id="recap-heading" className="text-t1 text-fg-neutral font-bold">
        리플레이: 저축 리포트
      </h2>
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-1">
        <RecapCard
          eyebrow="주간 리플레이"
          period={`${formatDate(weekly.period.startDate)} ~ ${formatDateBefore(weekly.period.endDateExclusive)}`}
          status={weekly.status}
          message={weeklyMessage(weekly)}
          href={
            weekly.status === "SUCCEEDED" && weekly.result !== null
              ? `/recaps/weekly?weekStart=${weekly.period.startDate}`
              : null
          }
          tone="light"
        />
        <RecapCard
          eyebrow="월간 리플레이"
          period={`${Number(monthly.period.startDate.slice(5, 7))}월`}
          status={monthly.status}
          message={monthlyMessage(monthly)}
          href={
            monthly.status === "SUCCEEDED" && monthly.result !== null
              ? `/recaps/monthly?month=${monthly.period.startDate.slice(0, 7)}`
              : null
          }
          tone="deep"
        />
      </div>
    </section>
  );
}

function RecapCard({
  eyebrow,
  period,
  status,
  message,
  href,
  tone,
}: {
  readonly eyebrow: string;
  readonly period: string;
  readonly status: WeeklyRecap["status"] | MonthlyRecap["status"];
  readonly message: string;
  readonly href: string | null;
  readonly tone: "light" | "deep";
}) {
  const card = (
    <article
      className={`flex h-[300px] w-60 shrink-0 flex-col justify-between overflow-hidden rounded-[20px] px-6 py-[42px] text-white [filter:drop-shadow(0_2px_2px_rgba(0,0,0,0.15))] ${
        tone === "light"
          ? "bg-[linear-gradient(142deg,var(--color-pink-2)_3%,var(--color-pink-6)_100%)]"
          : "bg-[linear-gradient(142deg,var(--color-pink-10)_3%,var(--color-pink-6)_100%)]"
      }`}
    >
      <div>
        <p className="text-[13px] leading-5 font-semibold tracking-[-0.3px]">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-[32px] leading-10 font-bold tracking-[-0.8px]">
          {period}
        </h3>
      </div>
      <div>
        <p className="text-[15px] leading-6 font-semibold tracking-[-0.3px]">
          {message}
        </p>
        <p className="mt-3 text-[12px] leading-5 tracking-[-0.3px] opacity-90">
          {href === null ? statusLabel(status) : "자세히 보기"}
        </p>
      </div>
    </article>
  );

  return href === null ? (
    card
  ) : (
    <Link href={href} aria-label={`${eyebrow} 자세히 보기`}>
      {card}
    </Link>
  );
}

function weeklyMessage(recap: WeeklyRecap) {
  if (recap.status === "SUCCEEDED" && recap.result !== null) {
    return recap.result.page1LastWeekPerformance.achievement.message;
  }
  return stateMessage(recap.status, "주간");
}

function monthlyMessage(recap: MonthlyRecap) {
  if (recap.status === "SUCCEEDED" && recap.result !== null) {
    return recap.result.typeSection.message;
  }
  if (recap.status === "NOT_ELIGIBLE") {
    return "저축 기록이 3번 모이면 월간 리플레이가 열려요.";
  }
  return stateMessage(recap.status, "월간");
}

function stateMessage(status: WeeklyRecap["status"], kind: "주간" | "월간") {
  if (status === "GENERATING") return `${kind} 리플레이를 만들고 있어요.`;
  if (status === "FAILED" || status === "SUCCEEDED") {
    return `${kind} 리플레이를 불러오지 못했어요.`;
  }
  return `아직 ${kind} 리플레이가 없어요.`;
}

function statusLabel(status: WeeklyRecap["status"] | MonthlyRecap["status"]) {
  if (status === "GENERATING") return "생성 중";
  if (status === "NOT_ELIGIBLE") return "기록을 더 모아 주세요";
  if (status === "FAILED") return "잠시 후 다시 확인해 주세요";
  if (status === "SUCCEEDED") return "결과를 다시 확인해 주세요";
  return "다음 리플레이를 기다리는 중";
}

function formatDate(value: string) {
  return `${Number(value.slice(5, 7))}.${Number(value.slice(8, 10))}`;
}

function formatDateBefore(value: string) {
  const date = new Date(`${value}T00:00:00+09:00`);
  date.setUTCDate(date.getUTCDate() - 1);
  return `${date.getUTCMonth() + 1}.${date.getUTCDate()}`;
}
