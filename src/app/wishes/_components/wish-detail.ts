import type { WishItem, WishItemState } from "./wish-item";

/** 상세 화면이 그리는 데 필요한 위시 정보입니다. */
export interface WishDetail extends WishItem {
  /** 저축을 시작한 날짜이며 `26.08.16` 형태입니다. */
  readonly startDate: string;
  /** 목표 날짜이며 없으면 빈 문자열입니다. */
  readonly targetDate: string;
  /** 학생이 올린 목표 사진입니다. */
  readonly imageUrl?: string;
}

/** 저축 기록 한 줄입니다. */
export interface FundMovementItem {
  /** 원장 이벤트 식별자입니다. */
  readonly id: string;
  /** 이동이 일어난 시각입니다. */
  readonly occurredAt: Date;
  /** 위시에 들어온 이동인지 나간 이동인지 구분합니다. */
  readonly kind: "DEPOSIT" | "WITHDRAWAL";
  /** 이동한 금액이며 항상 0보다 큽니다. */
  readonly amount: number;
  /** 이동 직후 위시에 남은 금액입니다. */
  readonly balanceAfter: number;
}

const FINISHED_STATES: readonly WishItemState[] = ["COMPLETED", "ABANDONED"];

/** 완료하거나 포기해 더 이상 진행하지 않는 상태인지 판단합니다. */
export function isFinishedState(state: WishItemState) {
  return FINISHED_STATES.includes(state);
}
