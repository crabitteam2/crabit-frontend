import "server-only";

import { unwrapResult, type ApiResult } from "@/lib/http/result";
import { getWish, listWishes } from "@/lib/http/wishes";
import {
  toOwnedWishItem,
  type OwnedWishItem,
  type WishItemState,
} from "../_components/wish-item";
import { loadAccountContext } from "../load-account";

const WISH_PAGE_LIMIT = 100;

const FINISHED_STATES: readonly WishItemState[] = ["COMPLETED", "ABANDONED"];

/** 카드에서 보내거나 카드로 되돌릴 때 상대로 지정하는 식별자입니다. */
export const CARD_COUNTERPART_ID = "card";

const CARD_NAME = "크래빗 카드 사용가능 금액";

const CARD_NUMBER = "0000-0000-0000-0000";

/** 돈 넣기와 돈 꺼내기 화면이 그리는 카드 잔액입니다. */
export interface FundFlowCard {
  /** 카드 잔액 칸에 붙는 이름입니다. */
  readonly name: string;
  /** 카드 번호 표기입니다. */
  readonly cardNumber: string;
  /** 쓸 수 있는 카드 잔액이며, 아직 조회하지 못했으면 null입니다. */
  readonly availableBalance: number | null;
}

/** 돈 넣기와 돈 꺼내기 흐름이 공통으로 필요한 정보입니다. */
export interface FundFlowView {
  /** 상대로 고를 수 있는 카드 잔액입니다. */
  readonly card: FundFlowCard;
  /** 돈이 드나드는 위시입니다. */
  readonly wish: OwnedWishItem;
  /** 상대로 고를 수 있는 같은 계좌의 다른 활성 위시입니다. */
  readonly others: OwnedWishItem[];
  /**
   * 카드 잔액이 모자란 금액입니다.
   *
   * 잔액을 한 번도 조회하지 못한 계좌에서는 모자란지 알 수 없어 null입니다.
   */
  readonly unresolvedShortage: number | null;
}

/** 돈이 드나드는 상대이며 카드 잔액이거나 같은 계좌의 다른 위시입니다. */
export type FundCounterpart =
  | { readonly kind: "card"; readonly card: FundFlowCard }
  | { readonly kind: "wish"; readonly wish: OwnedWishItem };

/**
 * 흐름에 필요한 위시, 카드 잔액, 다른 활성 위시를 한 번에 조회합니다.
 *
 * 없는 위시면 null을 돌려줍니다.
 */
export async function loadFundFlow(
  wishId: string,
): Promise<FundFlowView | null> {
  const { client, cardBalanceAccountId, account } = await loadAccountContext();
  const [wish, page] = await Promise.all([
    getWish(client, { cardBalanceAccountId, wishId }),
    listWishes(client, { cardBalanceAccountId, limit: WISH_PAGE_LIMIT }),
  ]);

  if (isNotFound(wish)) return null;

  const wishes = unwrapResult(page).items.map(toOwnedWishItem);

  return {
    card: {
      name: CARD_NAME,
      cardNumber: CARD_NUMBER,
      availableBalance: account.displayAvailableBalance,
    },
    wish: toOwnedWishItem(unwrapResult(wish)),
    others: wishes.filter(
      (item) => item.id !== wishId && !FINISHED_STATES.includes(item.state),
    ),
    unresolvedShortage: account.unresolvedShortage,
  };
}

/** 쿼리로 받은 상대 식별자를 카드 잔액이나 다른 위시로 옮기며, 못 찾으면 null입니다. */
export function findCounterpart(
  view: FundFlowView,
  counterpartId: string | undefined,
): FundCounterpart | null {
  if (counterpartId === undefined) return null;
  if (counterpartId === CARD_COUNTERPART_ID) {
    return { kind: "card", card: view.card };
  }

  const wish = view.others.find((item) => item.id === counterpartId);
  return wish === undefined ? null : { kind: "wish", wish };
}

function isNotFound(result: ApiResult<unknown>) {
  return !result.ok && result.error.status === 404;
}

/** 쿼리 값이 배열로 와도 첫 값만 씁니다. */
export function firstQueryValue(
  raw: string | string[] | undefined,
): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

/** 쿼리로 받은 금액을 양의 정수로 읽으며, 쓸 수 없는 값이면 0입니다. */
export function parseAmount(raw: string | string[] | undefined): number {
  const value = Number(firstQueryValue(raw) ?? 0);
  if (!Number.isSafeInteger(value) || value <= 0) return 0;
  return value;
}
