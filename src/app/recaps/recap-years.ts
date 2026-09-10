import "server-only";

import { unwrapResult } from "@/lib/http/result";
import { listWishes } from "@/lib/http/wishes";
import { loadAccountContext } from "../wishes/load-account";
import { getMonthlyRecap } from "@/lib/http/recaps";
import { latestCompletedMonth } from "./monthly/monthly-recap-view";

const WISH_PAGE_LIMIT = 100;

/**
 * 월간 리캡이 있는 연도를 오래된 순으로 찾습니다.
 *
 * 어느 달에 리캡이 있는지 알려주는 계약이 없어 끝난 달을 하나씩 조회합니다.
 * 리캡은 위시가 있어야 만들어지므로 가장 오래된 위시가 생긴 달부터만 봅니다.
 * 목록을 주는 계약이 생기면 이 파일을 지운다.
 */
export async function listRecapYears(): Promise<number[]> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const wishes = unwrapResult(
    await listWishes(client, { cardBalanceAccountId, limit: WISH_PAGE_LIMIT }),
  );
  if (wishes.items.length === 0) return [];

  const first = wishes.items
    .map((wish) => wish.createdAt)
    .reduce((oldest, value) => (value < oldest ? value : oldest));
  const months = toCompletedMonths(first.slice(0, 7), latestCompletedMonth());

  const recaps = await Promise.all(
    months.map(async (month) =>
      unwrapResult(
        await getMonthlyRecap(client, { cardBalanceAccountId, month }),
      ),
    ),
  );

  const years = recaps
    .filter((recap) => recap.status === "SUCCEEDED")
    .map((recap) => Number(recap.period.startDate.slice(0, 4)));

  return [...new Set(years)].sort((left, right) => left - right);
}

function toCompletedMonths(from: string, to: string) {
  const [fromYear, fromMonth] = from.split("-").map(Number) as [number, number];
  const [toYear, toMonth] = to.split("-").map(Number) as [number, number];
  const count = toYear * 12 + toMonth - (fromYear * 12 + fromMonth) + 1;

  return Array.from({ length: Math.max(0, count) }, (_, index) => {
    const shifted = new Date(Date.UTC(fromYear, fromMonth - 1 + index, 1));
    return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}
