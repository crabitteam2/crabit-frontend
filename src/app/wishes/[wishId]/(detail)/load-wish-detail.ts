import "server-only";

import { unwrapResult, type ApiResult } from "@/lib/http/result";
import { getWish, listWishFundMovements } from "@/lib/http/wishes";
import type { components } from "@/lib/http/generated/crabit-backend";
import type {
  FundMovementItem,
  WishDetail,
} from "../../_components/wish-detail";
import { loadAccountContext } from "../../load-account";

const MOVEMENT_PAGE_LIMIT = 100;

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
});

/** 상세 화면이 그리는 데 필요한 위시와 저축 기록입니다. */
export interface WishDetailView {
  /** 조회한 위시입니다. */
  readonly wish: WishDetail;
  /** 최근 순으로 정렬된 저축 기록입니다. */
  readonly movements: FundMovementItem[];
}

/** 위시 한 건과 저축 기록을 함께 조회하며, 없는 위시면 null을 돌려줍니다. */
export async function loadWishDetail(
  wishId: string,
): Promise<WishDetailView | null> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const [wish, movements] = await Promise.all([
    getWish(client, { cardBalanceAccountId, wishId }),
    listWishFundMovements(client, {
      cardBalanceAccountId,
      wishId,
      limit: MOVEMENT_PAGE_LIMIT,
    }),
  ]);

  if (isNotFound(wish) || isNotFound(movements)) return null;

  return {
    wish: toWishDetail(unwrapResult(wish)),
    movements: unwrapResult(movements).items.map(toFundMovementItem),
  };
}

function isNotFound(result: ApiResult<unknown>) {
  return !result.ok && result.error.status === 404;
}

function toWishDetail(wish: components["schemas"]["Wish"]): WishDetail {
  return {
    id: wish.id,
    purpose: wish.purpose,
    amount: wish.amount,
    targetAmount: wish.targetAmount,
    state: wish.state,
    startDate: toShortDate(wish.createdAt),
    targetDate: wish.targetDate === null ? "" : toShortDate(wish.targetDate),
  };
}

function toFundMovementItem(
  movement: components["schemas"]["WishFundMovement"],
): FundMovementItem {
  return {
    id: movement.eventId,
    occurredAt: new Date(movement.occurredAt),
    kind: movement.wishAmountDelta > 0 ? "DEPOSIT" : "WITHDRAWAL",
    amount: Math.abs(movement.wishAmountDelta),
    balanceAfter: movement.wishAmountAfter,
  };
}

function toShortDate(value: string) {
  return dateFormatter.format(new Date(value)).replaceAll("-", ".");
}
