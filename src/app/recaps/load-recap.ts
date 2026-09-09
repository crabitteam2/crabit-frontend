import "server-only";

import type { components } from "@/lib/http/generated/crabit-backend";
import { getMonthlyRecap, getWeeklyRecap } from "@/lib/http/recaps";
import { unwrapResult } from "@/lib/http/result";
import type { ServerApiClient } from "@/lib/http/server";
import { loadAccountContext } from "../wishes/load-account";
import {
  isCompletedMonth,
  latestCompletedMonth,
  shiftMonth,
} from "./monthly/monthly-recap-view";

type MonthlyRecap = components["schemas"]["MonthlyRecapResponse"];

/** 인증 학생의 완료 주 리캡을 조회합니다. */
export async function loadWeeklyRecap(weekStart?: string) {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  return unwrapResult(
    await getWeeklyRecap(client, { cardBalanceAccountId, weekStart }),
  );
}

const FALLBACK_MONTHS = 3;

/**
 * 완성된 월간 리캡을 찾습니다.
 *
 * 가장 최근 완료 월의 리캡이 아직 만들어지지 않았으면 이전 달로 거슬러 올라갑니다.
 * 세 달을 봐도 없으면 가장 최근 달의 상태를 그대로 돌려줍니다.
 */
export async function findLatestMonthlyRecap(
  client: ServerApiClient,
  cardBalanceAccountId: string,
) {
  const latest = await readMonthlyRecap(client, cardBalanceAccountId);
  if (latest.status === "SUCCEEDED") return latest;

  for (let step = 1; step <= FALLBACK_MONTHS; step += 1) {
    const previous = await readMonthlyRecap(
      client,
      cardBalanceAccountId,
      shiftMonth(latest.period.startDate, -step),
    );
    if (previous.status === "SUCCEEDED") return previous;
  }

  return latest;
}

async function readMonthlyRecap(
  client: ServerApiClient,
  cardBalanceAccountId: string,
  month?: string,
): Promise<MonthlyRecap> {
  if (month !== undefined && !isCompletedMonth(month)) {
    return toPendingMonthlyRecap(month);
  }

  return unwrapResult(
    await getMonthlyRecap(client, { cardBalanceAccountId, month }),
  );
}

/** 아직 끝나지 않은 달을 조회 없이 빈 상태로 만듭니다. */
function toPendingMonthlyRecap(month: string): MonthlyRecap {
  const [year, monthNumber] = month.split("-").map(Number) as [number, number];
  const next = new Date(Date.UTC(year, monthNumber, 1));

  return {
    kind: "MONTHLY",
    status: "NOT_GENERATED",
    schemaVersion: 1,
    algorithmVersion: null,
    generationVersion: null,
    generatedAt: null,
    period: {
      startDate: `${month}-01`,
      endDateExclusive: `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-01`,
      timezone: "Asia/Seoul",
    },
    result: null,
  };
}

/**
 * 그 해에서 완성된 가장 최근 리캡을 찾습니다.
 *
 * 어느 달에 리캡이 있는지 알려주는 계약이 없어 그 해의 끝난 달을 한 번에 조회합니다.
 * 완성된 리캡이 하나도 없으면 그 해 마지막 달의 상태를 돌려줍니다.
 */
async function findMonthlyRecapInYear(
  client: ServerApiClient,
  cardBalanceAccountId: string,
  year: number,
): Promise<MonthlyRecap> {
  const [latestYear, latestMonth] = latestCompletedMonth()
    .split("-")
    .map(Number) as [number, number];
  const lastMonth = year < latestYear ? 12 : latestMonth;

  const months = Array.from(
    { length: lastMonth },
    (_, index) => `${year}-${String(index + 1).padStart(2, "0")}`,
  );
  const recaps = await Promise.all(
    months.map((month) =>
      readMonthlyRecap(client, cardBalanceAccountId, month),
    ),
  );

  return (
    [...recaps].reverse().find((recap) => recap.status === "SUCCEEDED") ??
    recaps[recaps.length - 1]!
  );
}

/**
 * 인증 학생의 월간 리캡을 계좌 식별자와 함께 조회합니다.
 *
 * 달을 고르면 그 달만, 해를 고르면 그 해에서 완성된 가장 최근 달을 조회합니다.
 * 둘 다 없으면 완성된 가장 최근 리캡을 찾습니다.
 */
export async function loadMonthlyRecap(month?: string, year?: number) {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const recap =
    month !== undefined
      ? await readMonthlyRecap(client, cardBalanceAccountId, month)
      : year !== undefined
        ? await findMonthlyRecapInYear(client, cardBalanceAccountId, year)
        : await findLatestMonthlyRecap(client, cardBalanceAccountId);

  return { recap, cardBalanceAccountId };
}
