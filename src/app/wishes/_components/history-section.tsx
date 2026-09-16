"use client";

import { useState } from "react";
import {
  DEFAULT_PERIOD,
  DEFAULT_SORT,
  HistoryFilterBar,
} from "./history-filter-bar";
import { filterMovements } from "./history-filter";
import type { HistoryPeriod, HistorySort } from "./history-filter-sheet";
import { HistoryList } from "./history-list";
import type { HistorySearchKind } from "./history-search-dialog";
import type { FundMovementItem } from "./wish-detail";

interface HistorySectionProps {
  movements: FundMovementItem[];
}

export function HistorySection({ movements }: HistorySectionProps) {
  const [period, setPeriod] = useState<HistoryPeriod>(DEFAULT_PERIOD);
  const [sort, setSort] = useState<HistorySort>(DEFAULT_SORT);
  const [kind, setKind] = useState<HistorySearchKind | null>(null);

  const visible = filterMovements(movements, period, sort, kind);

  return (
    <>
      <HistoryFilterBar
        period={period}
        sort={sort}
        kind={kind}
        onApply={(nextPeriod, nextSort) => {
          setPeriod(nextPeriod);
          setSort(nextSort);
        }}
        onKindChange={setKind}
      />
      <HistoryList movements={visible} />
    </>
  );
}
