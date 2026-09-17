import type { WishItem } from "./wish-item";

/**
 * 화면에 표시할 모은 금액을 고릅니다.
 *
 * 완료와 포기는 모은 돈이 카드로 돌아가 현재 금액이 0이므로 끝난 시점의 금액을
 * 씁니다. 완료는 목표 금액에 도달해야만 되므로 그 시점 금액이 목표 금액입니다.
 */
export function toWishDisplayAmount(
  wish: Pick<
    WishItem,
    "state" | "amount" | "abandonmentAmount" | "targetAmount"
  >,
) {
  if (wish.state === "ABANDONED") {
    if (typeof wish.abandonmentAmount !== "number") {
      throw new Error("ABANDONED Wish must have an abandonmentAmount");
    }
    return wish.abandonmentAmount;
  }

  if (wish.abandonmentAmount !== null) {
    throw new Error("Non-abandoned Wish must not have an abandonmentAmount");
  }

  if (wish.state === "COMPLETED") return wish.targetAmount;

  return wish.amount;
}
