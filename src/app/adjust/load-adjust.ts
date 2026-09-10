import "server-only";

import { toProgressPercent } from "@/app/_components/progress-stage";
import { unwrapResult } from "@/lib/http/result";
import { listWishes } from "@/lib/http/wishes";
import {
  toOwnedWishItem,
  type WishItemState,
} from "../wishes/_components/wish-item";
import { loadAccountContext } from "../wishes/load-account";
import type { AdjustCard, AdjustWish } from "./_components/adjust-wish-list";

const WISH_PAGE_LIMIT = 100;

const FINISHED_STATES: readonly WishItemState[] = ["COMPLETED", "ABANDONED"];

const CARD_NUMBER = "0000-0000-0000-0000";

/** 잔액 조정 화면이 그리는 데 필요한 카드와 위시입니다. */
export interface AdjustView {
  /** 부족액과 카드 잔액을 담은 카드 요약입니다. */
  readonly card: AdjustCard;
  /** 돈을 꺼낼 수 있는 활성 위시입니다. */
  readonly wishes: AdjustWish[];
}

/**
 * 카드 잔액이 모자란지 확인하고 돈을 꺼낼 수 있는 위시를 조회합니다.
 *
 * 모자라지 않거나 잔액을 조회하지 못했으면 null을 돌려줍니다.
 */
export async function loadAdjust(nickname: string): Promise<AdjustView | null> {
  const { client, cardBalanceAccountId, account } = await loadAccountContext();
  if (account.unresolvedShortage === null || account.unresolvedShortage <= 0) {
    return null;
  }

  const page = unwrapResult(
    await listWishes(client, {
      cardBalanceAccountId,
      limit: WISH_PAGE_LIMIT,
    }),
  );

  return {
    card: {
      label: `${nickname}의 크래빗 카드`,
      balance: account.displayAvailableBalance,
      shortage: account.unresolvedShortage,
      cardNumber: CARD_NUMBER,
    },
    wishes: page.items
      .map(toOwnedWishItem)
      .filter(
        (wish) => wish.amount > 0 && !FINISHED_STATES.includes(wish.state),
      )
      .map((wish) => ({
        id: wish.id,
        label: wish.purpose,
        amount: wish.amount,
        percent: toProgressPercent(wish.amount, wish.targetAmount),
      })),
  };
}
