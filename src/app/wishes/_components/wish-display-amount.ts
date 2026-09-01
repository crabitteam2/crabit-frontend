import type { WishItem } from "./wish-item";

/** 현재 금액과 포기 시점 역사 금액 중 화면에 표시할 값을 고릅니다. */
export function toWishDisplayAmount(
  wish: Pick<WishItem, "state" | "amount" | "abandonmentAmount">,
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

  return wish.amount;
}
