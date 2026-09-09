import { NICKNAME } from "@/lib/mock/home";
import { loadMonthlyRecap } from "../load-recap";
import { MonthlyRecapEmpty } from "../_components/monthly-recap-empty";
import { MonthlyRecapScreen } from "../_components/monthly-recap-screen";
import {
  collectHighlights,
  pickHighlights,
  toMonthTabs,
  toSubjectParticle,
} from "./monthly-recap-view";

const MONTH_PATTERN = /^\d{4}-\d{2}$/;

const YEAR_PATTERN = /^\d{4}$/;

export default async function MonthlyRecapPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const selectedMonth = firstQueryValue(query.month);
  const month =
    selectedMonth !== undefined && MONTH_PATTERN.test(selectedMonth)
      ? selectedMonth
      : undefined;
  const selectedYear = firstQueryValue(query.year);
  const chosenYear =
    selectedYear !== undefined && YEAR_PATTERN.test(selectedYear)
      ? Number(selectedYear)
      : undefined;

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
      <MonthlyRecapEmpty
        backHref="/"
        year={year}
        months={months}
        message={`${monthNumber}월 리캡이 아직 완성되지 않았어요.\n${(monthNumber % 12) + 1}월 초에 다시 확인하세요.`}
      />
    );
  }

  const highlights = pickHighlights(
    collectHighlights(recap.result),
    `${cardBalanceAccountId}:${recap.period.startDate}`,
  );

  return (
    <MonthlyRecapScreen
      backHref="/"
      year={year}
      months={months}
      intro={`${monthNumber}월의 ${NICKNAME}${toSubjectParticle(NICKNAME)}`}
      typeTitle={recap.result.typeSection.typeTitle}
      typeMessage={recap.result.typeSection.message}
      highlights={highlights}
    />
  );
}

function toMonthHref(year: number, month: number) {
  return `/recaps/monthly?month=${year}-${String(month).padStart(2, "0")}`;
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
