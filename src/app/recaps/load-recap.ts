import "server-only";

import type { components } from "@/lib/http/generated/crabit-backend";
import { getMonthlyRecap, getWeeklyRecap } from "@/lib/http/recaps";
import { unwrapResult } from "@/lib/http/result";
import type { ServerApiClient } from "@/lib/http/server";
import { loadAccountContext } from "../wishes/load-account";
import { isCompletedMonth, shiftMonth } from "./monthly/monthly-recap-view";

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
 * 인증 학생의 월간 리캡을 계좌 식별자, 리캡이 있는 달과 함께 조회합니다.
 *
 * 달을 고르면 그 달만 조회하고, 고르지 않으면 완성된 가장 최근 리캡을 찾습니다.
 * 어느 달에 리캡이 있는지 알려주는 계약이 아직 없어 `availableMonths`는 비어 있습니다.
 */
export async function loadMonthlyRecap(month?: string) {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const recap =
    month === undefined
      ? await findLatestMonthlyRecap(client, cardBalanceAccountId)
      : await readMonthlyRecap(client, cardBalanceAccountId, month);

  return {
    recap,
    cardBalanceAccountId,
    availableMonths: [] as readonly string[],
  };
}
