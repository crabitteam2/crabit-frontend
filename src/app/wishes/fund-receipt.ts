import "server-only";

import { listWishFundMovements } from "@/lib/http/wishes";
import { loadAccountContext } from "./load-account";

const RECEIPT_PAGE_LIMIT = 20;

/** 위시에 들어온 이동인지 나간 이동인지 구분합니다. */
export type FundDirection = "DEPOSIT" | "WITHDRAWAL";

/** 방금 끝난 자금 이동 한 건입니다. */
export interface FundReceipt {
  /** 옮긴 금액이며 항상 0보다 큽니다. */
  readonly amount: number;
  /** 이동 직후 위시에 남은 금액입니다. */
  readonly balanceAfter: number;
}

/**
 * 원장 이벤트 식별자로 방금 끝난 자금 이동을 확인합니다.
 *
 * 식별자가 없거나 그 위시의 기록에서 찾지 못하면 null을 돌려주며,
 * 기록의 방향이 화면과 다를 때도 null입니다.
 */
export async function loadFundReceipt(
  wishId: string,
  eventId: string | undefined,
  direction: FundDirection,
): Promise<FundReceipt | null> {
  if (eventId === undefined || eventId === "") return null;

  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await listWishFundMovements(client, {
    cardBalanceAccountId,
    wishId,
    limit: RECEIPT_PAGE_LIMIT,
  });
  if (!result.ok) return null;

  const movement = result.data.items.find((item) => item.eventId === eventId);
  if (movement === undefined) return null;
  if (toDirection(movement.wishAmountDelta) !== direction) return null;

  return {
    amount: Math.abs(movement.wishAmountDelta),
    balanceAfter: movement.wishAmountAfter,
  };
}

function toDirection(delta: number): FundDirection {
  return delta > 0 ? "DEPOSIT" : "WITHDRAWAL";
}
