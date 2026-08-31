import type { components } from "@/lib/http/generated/crabit-backend";

/** 위시의 진행 단계입니다. */
export type WishItemState = components["schemas"]["WishState"];

/** 목록과 카드가 그리는 데 필요한 최소 위시 정보입니다. */
export interface WishItem {
  /** 위시 식별자입니다. */
  readonly id: string;
  /** 위시 이름입니다. */
  readonly purpose: string;
  /** 지금까지 모은 금액입니다. */
  readonly amount: number;
  /** 목표 금액입니다. */
  readonly targetAmount: number;
  /** 위시의 진행 단계입니다. */
  readonly state: WishItemState;
}

/** 쓰기 요청에 필요한 낙관적 동시성 버전까지 담은 내 위시입니다. */
export interface OwnedWishItem extends WishItem {
  /** 서버가 내려준 위시 스냅샷 버전입니다. */
  readonly version: number;
}
