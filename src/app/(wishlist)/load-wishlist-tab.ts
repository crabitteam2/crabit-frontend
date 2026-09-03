import "server-only";

import { unwrapResult } from "@/lib/http/result";
import { getRepresentativeWish } from "@/lib/http/wishes";
import { loadAccountContext } from "../wishes/load-account";

/** 위시리스트 탭이 진행률로 그리는 대표 위시입니다. */
export interface RepresentativeWishView {
  /** 위시 이름입니다. */
  readonly purpose: string;
  /** 지금까지 모은 금액입니다. */
  readonly amount: number;
  /** 목표 금액입니다. */
  readonly targetAmount: number;
}

/** 위시리스트 탭이 그리는 데 필요한 정보입니다. */
export interface WishlistTabView {
  /** 대표로 선택된 위시이며, 고르지 않았으면 null입니다. */
  readonly representativeWish: RepresentativeWishView | null;
  /**
   * 카드 잔액이 모자란 금액입니다.
   *
   * 잔액을 한 번도 조회하지 못한 계좌에서는 모자란지 알 수 없어 null입니다.
   */
  readonly unresolvedShortage: number | null;
}

/** 인증된 학생의 첫 카드잔액계좌에서 대표 위시와 부족액을 조회합니다. */
export async function loadWishlistTab(): Promise<WishlistTabView> {
  const { client, cardBalanceAccountId, account } = await loadAccountContext();
  const representative = unwrapResult(
    await getRepresentativeWish(client, { cardBalanceAccountId }),
  );

  return {
    representativeWish:
      representative === undefined
        ? null
        : {
            purpose: representative.purpose,
            amount: representative.amount,
            targetAmount: representative.targetAmount,
          },
    unresolvedShortage: account.unresolvedShortage,
  };
}
