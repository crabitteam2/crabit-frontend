import "server-only";

import { headers } from "next/headers";
import { listMyCardBalanceAccounts } from "@/lib/http/card-balance-accounts";
import { unwrapResult } from "@/lib/http/result";
import { createServerApiClient } from "@/lib/http/server";
import { getRepresentativeWish, listWishes } from "@/lib/http/wishes";
import type { WishItem, WishItemState } from "../_components/wish-item";

const WISH_PAGE_LIMIT = 100;

const FINISHED_STATES: readonly WishItemState[] = ["COMPLETED", "ABANDONED"];

/** 위시 목록 화면이 그리는 데 필요한 위시 묶음입니다. */
export interface WishListView {
  /** 대표 위시를 맨 앞에 둔 진행중인 위시입니다. */
  readonly inProgress: WishItem[];
  /** 완료하거나 포기한 위시입니다. */
  readonly finished: WishItem[];
  /** 대표로 선택된 위시 식별자이며, 없으면 null입니다. */
  readonly representativeId: string | null;
}

/** 계좌를 하나도 받지 못해 위시를 조회할 수 없을 때 발생합니다. */
export class CardBalanceAccountMissingError extends Error {
  constructor() {
    super("No card balance account is available for this student");
    this.name = "CardBalanceAccountMissingError";
  }
}

/**
 * 인증된 학생의 첫 카드잔액계좌에서 위시 목록과 대표 위시를 조회합니다.
 *
 * @throws {@link CardBalanceAccountMissingError} 계좌를 하나도 받지 못했을 때 발생합니다.
 */
export async function loadWishList(): Promise<WishListView> {
  const cookie = (await headers()).get("cookie") ?? "";
  const client = createServerApiClient({
    request: { headers: new Headers({ cookie }) },
  });

  const accounts = unwrapResult(await listMyCardBalanceAccounts(client));
  const account = accounts.items[0];
  if (account === undefined) {
    throw new CardBalanceAccountMissingError();
  }

  const cardBalanceAccountId = account.cardBalanceAccountId;
  const [page, representative] = await Promise.all([
    listWishes(client, { cardBalanceAccountId, limit: WISH_PAGE_LIMIT }),
    getRepresentativeWish(client, { cardBalanceAccountId }),
  ]);

  const wishes = unwrapResult(page).items;
  const representativeId = unwrapResult(representative)?.id ?? null;
  const active = wishes.filter((wish) => !FINISHED_STATES.includes(wish.state));

  return {
    inProgress: hoistRepresentative(active, representativeId),
    finished: wishes.filter((wish) => FINISHED_STATES.includes(wish.state)),
    representativeId,
  };
}

function hoistRepresentative(wishes: WishItem[], wishId: string | null) {
  if (wishId === null) return wishes;

  const picked = wishes.filter((wish) => wish.id === wishId);
  if (picked.length === 0) return wishes;

  return [...picked, ...wishes.filter((wish) => wish.id !== wishId)];
}
