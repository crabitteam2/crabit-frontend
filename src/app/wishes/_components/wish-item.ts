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
  /**
   * 포기 직전에 모았던 역사 금액이며 owner API에서 만든 항목에는 항상 존재합니다.
   * 테마만 공유하는 기존 구조적 호출자는 이 필드를 전달하지 않을 수 있습니다.
   */
  readonly abandonmentAmount?: number | null;
  /** 목표 금액입니다. */
  readonly targetAmount: number;
  /** 위시의 진행 단계입니다. */
  readonly state: WishItemState;
  /** 현재 권한으로 발급된 짧은 사진 URL이며 사진이 없으면 생략합니다. */
  readonly imageUrl?: string;
}

/** 쓰기 요청에 필요한 낙관적 동시성 버전까지 담은 내 위시입니다. */
export interface OwnedWishItem extends WishItem {
  /** 서버가 내려준 위시 스냅샷 버전입니다. */
  readonly version: number;
}

/** 백엔드 Wish 계약을 목록과 상세에서 공유하는 명시적 화면 모델로 옮깁니다. */
export function toWishItem(wish: components["schemas"]["Wish"]): WishItem {
  assertAbandonmentAmountContract(wish);

  return {
    id: wish.id,
    purpose: wish.purpose,
    amount: wish.amount,
    abandonmentAmount: wish.abandonmentAmount,
    targetAmount: wish.targetAmount,
    state: wish.state,
    ...(wish.photo == null ? {} : { imageUrl: wish.photo.variants.medium }),
  };
}

/** 버전까지 담아 쓰기 요청에 바로 쓸 수 있는 화면 모델로 옮깁니다. */
export function toOwnedWishItem(
  wish: components["schemas"]["Wish"],
): OwnedWishItem {
  return { ...toWishItem(wish), version: wish.version };
}

function assertAbandonmentAmountContract(
  wish: Pick<WishItem, "state" | "abandonmentAmount" | "targetAmount">,
) {
  if (wish.state === "ABANDONED") {
    if (
      typeof wish.abandonmentAmount !== "number" ||
      !Number.isSafeInteger(wish.abandonmentAmount) ||
      wish.abandonmentAmount < 0 ||
      wish.abandonmentAmount > wish.targetAmount
    ) {
      throw new Error("ABANDONED Wish must have a valid abandonmentAmount");
    }
    return;
  }

  if (wish.abandonmentAmount !== null) {
    throw new Error("Active or completed Wish must not have abandonmentAmount");
  }
}
