import "server-only";

import { listAllWishes } from "../wishes/list-all-wishes";
import {
  toOwnedWishItem,
  type WishItemState,
} from "../wishes/_components/wish-item";
import { loadAccountContext } from "../wishes/load-account";
import type { AdjustWish } from "./_components/adjust-withdraw-form";

const FINISHED_STATES: readonly WishItemState[] = ["COMPLETED", "ABANDONED"];

/** 잔액 조정 화면이 그리는 데 필요한 부족액과 위시입니다. */
export interface AdjustView {
  /** 카드에 채워야 하는 금액입니다. */
  readonly shortage: number;
  /** 돈을 꺼낼 수 있는 활성 위시입니다. */
  readonly wishes: AdjustWish[];
}

/**
 * 카드 잔액이 모자란지 확인하고 돈을 꺼낼 수 있는 위시를 조회합니다.
 *
 * 모자라지 않거나 잔액을 조회하지 못했으면 null을 돌려줍니다.
 */
export async function loadAdjust(): Promise<AdjustView | null> {
  const { client, cardBalanceAccountId, account } = await loadAccountContext();
  if (account.unresolvedShortage === null || account.unresolvedShortage <= 0) {
    return null;
  }

  const page = await listAllWishes(client, cardBalanceAccountId);

  return {
    shortage: account.unresolvedShortage,
    wishes: page
      .map(toOwnedWishItem)
      .filter(
        (wish) => wish.amount > 0 && !FINISHED_STATES.includes(wish.state),
      )
      .map((wish) => ({
        id: wish.id,
        label: wish.purpose,
        amount: wish.amount,
        version: wish.version,
      })),
  };
}
