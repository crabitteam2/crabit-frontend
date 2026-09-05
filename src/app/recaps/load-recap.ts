import "server-only";

import { getMonthlyRecap, getWeeklyRecap } from "@/lib/http/recaps";
import { unwrapResult } from "@/lib/http/result";
import { loadAccountContext } from "../wishes/load-account";

/** 인증 학생의 완료 주 리캡을 조회합니다. */
export async function loadWeeklyRecap(weekStart?: string) {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  return unwrapResult(
    await getWeeklyRecap(client, { cardBalanceAccountId, weekStart }),
  );
}

/** 인증 학생의 완료 월 리캡을 조회합니다. */
export async function loadMonthlyRecap(month?: string) {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  return unwrapResult(
    await getMonthlyRecap(client, { cardBalanceAccountId, month }),
  );
}
