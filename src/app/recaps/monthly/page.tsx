import { redirect } from "next/navigation";
import { readPersonaDisplayName } from "@/lib/persona/display-name-server";
import { loadMonthlyRecap } from "../load-recap";
import { MonthlyRecapEmptyContent } from "../_components/monthly-recap-empty";
import { MonthlyRecapContent } from "../_components/monthly-recap-screen";
import {
  collectHighlights,
  pickHighlights,
  toMonthTabs,
  toMonthlyRecapEmptyMessage,
  toSubjectParticle,
} from "./monthly-recap-view";

import { MonthlyRecapLayout } from "../_components/monthly-recap-layout";

const MONTH_PATTERN = /^\d{4}-(?:0[1-9]|1[0-2])$/;

const YEAR_PATTERN = /^\d{4}$/;

/** 주소의 값이 달력에 있는 달과 해가 아니면 값을 떼고 기본 화면으로 되돌립니다. */
function assertReadable(month: string | undefined, year: string | undefined) {
  const hasBadMonth = month !== undefined && !MONTH_PATTERN.test(month);
  const hasBadYear =
    year !== undefined && (!YEAR_PATTERN.test(year) || Number(year) === 0);
  if (hasBadMonth || hasBadYear) redirect("/recaps/monthly");
}

export default async function MonthlyRecapPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const selectedMonth = firstQueryValue(query.month);
  const selectedYear = firstQueryValue(query.year);
  assertReadable(selectedMonth, selectedYear);

  const month = selectedMonth;
  const chosenYear =
    selectedYear === undefined ? undefined : Number(selectedYear);

  const { recap, cardBalanceAccountId } = await loadMonthlyRecap(
    month,
    chosenYear,
  );

  const [year, monthNumber] = recap.period.startDate.split("-").map(Number) as [
    number,
    number,
  ];
  const months = toMonthTabs(year, monthNumber, toMonthHref);

  if (recap.status !== "SUCCEEDED" || recap.result === null) {
    return (
      <MonthlyRecapLayout backHref="/" year={year} months={months}>
        <MonthlyRecapEmptyContent
          message={toMonthlyRecapEmptyMessage(
            recap.status,
            recap.period.startDate,
          )}
        />
      </MonthlyRecapLayout>
    );
  }

  const highlights = pickHighlights(
    collectHighlights(recap.result),
    `${cardBalanceAccountId}:${recap.period.startDate}`,
  );
  const nickname = await readPersonaDisplayName();

  return (
    <MonthlyRecapLayout
      backHref="/"
      year={year}
      months={months}
      typeTitle={recap.result.typeSection.typeTitle}
    >
      <MonthlyRecapContent
        intro={`${monthNumber}월의 ${nickname}${toSubjectParticle(nickname)}`}
        typeTitle={recap.result.typeSection.typeTitle}
        typeMessage={recap.result.typeSection.message}
        highlights={highlights}
      />
    </MonthlyRecapLayout>
  );
}

function toMonthHref(year: number, month: number) {
  return `/recaps/monthly?month=${year}-${String(month).padStart(2, "0")}`;
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
