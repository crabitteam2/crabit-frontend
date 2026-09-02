import type { HistoryPeriod, HistorySort } from "./history-filter-sheet";
import type { FundMovementItem } from "./wish-detail";

const MONTHS_BY_PERIOD: Record<HistoryPeriod, number> = {
  이번달: 0,
  "3개월": 3,
  "6개월": 6,
  "1년": 12,
};

/** 조회 기간과 정렬 기준에 맞춰 저축 기록을 고릅니다. */
export function filterMovements(
  movements: FundMovementItem[],
  period: HistoryPeriod,
  sort: HistorySort,
  now: Date = new Date(),
): FundMovementItem[] {
  return movements
    .filter((movement) => isWithinPeriod(movement.occurredAt, period, now))
    .sort((a, b) =>
      sort === "최신순"
        ? b.occurredAt.getTime() - a.occurredAt.getTime()
        : a.occurredAt.getTime() - b.occurredAt.getTime(),
    );
}

function isWithinPeriod(occurredAt: Date, period: HistoryPeriod, now: Date) {
  if (period === "이번달") {
    return (
      occurredAt.getFullYear() === now.getFullYear() &&
      occurredAt.getMonth() === now.getMonth()
    );
  }

  const from = new Date(now);
  from.setMonth(from.getMonth() - MONTHS_BY_PERIOD[period]);
  return occurredAt.getTime() >= from.getTime();
}
