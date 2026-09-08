import "server-only";

import { getMonthlyRecap, getWeeklyRecap } from "@/lib/http/recaps";
import { unwrapResult } from "@/lib/http/result";
import type { ServerApiClient } from "@/lib/http/server";
import { loadAccountContext } from "../wishes/load-account";
import { shiftMonth } from "./monthly/monthly-recap-view";

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
  const read = async (month?: string) =>
    unwrapResult(
      await getMonthlyRecap(client, { cardBalanceAccountId, month }),
    );

  const latest = await read();
  if (latest.status === "SUCCEEDED") return latest;

  for (let step = 1; step <= FALLBACK_MONTHS; step += 1) {
    const previous = await read(shiftMonth(latest.period.startDate, -step));
    if (previous.status === "SUCCEEDED") return previous;
  }

  return latest;
}

/**
 * 인증 학생의 월간 리캡을 계좌 식별자와 함께 조회합니다.
 *
 * 달을 고르면 그 달만 조회하고, 고르지 않으면 완성된 가장 최근 리캡을 찾습니다.
 */
export async function loadMonthlyRecap(month?: string) {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const recap =
    month === undefined
      ? await findLatestMonthlyRecap(client, cardBalanceAccountId)
      : unwrapResult(
          await getMonthlyRecap(client, { cardBalanceAccountId, month }),
        );

  return { recap, cardBalanceAccountId };
}
