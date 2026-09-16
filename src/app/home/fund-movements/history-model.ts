import type { components } from "@/lib/http/generated/crabit-backend";

export type FundMovement = components["schemas"]["AccountFundMovement"];
export type FundMovementPage = components["schemas"]["AccountFundMovementPage"];
const KST = 9 * 60 * 60 * 1000;

/** KST 오늘의 자정부터 세 달 전 날짜를 구하며 존재하지 않는 날짜는 말일로 제한합니다. */
export function recentThreeMonthBounds(now = new Date()) {
  const local = new Date(now.getTime() + KST);
  const year = local.getUTCFullYear();
  const month = local.getUTCMonth();
  const day = local.getUTCDate();
  const lastDay = new Date(Date.UTC(year, month - 2, 0)).getUTCDate();
  return {
    from: new Date(
      Date.UTC(year, month - 3, Math.min(day, lastDay)) - KST,
    ).toISOString(),
    to: new Date(Date.UTC(year, month, day + 1) - KST).toISOString(),
  };
}

const labels: Record<FundMovement["eventType"], string> = {
  CARD_BALANCE_CHANGE: "카드 잔액 변경",
  WISH_DEPOSIT: "위시 넣기",
  WISH_WITHDRAWAL: "위시 빼기",
  WISH_TRANSFER: "위시 간 이동",
  WISH_COMPLETION_RETURN: "위시 완료 반환",
  WISH_ABANDONMENT_RETURN: "위시 포기 반환",
  WISH_DELETION_RETURN: "위시 삭제 반환",
};
const money = (value: number) => value.toLocaleString("ko-KR");
const wishName = (wish: components["schemas"]["WishHistoryReference"]) =>
  `${wish.wishPurposeSnapshot}${wish.deletedWish ? " (삭제된 위시)" : ""}`;

export function movementPresentation(event: FundMovement) {
  const delta = event.accountAvailableBalanceDelta;
  const transfer = event.eventType === "WISH_TRANSFER";
  const local = new Date(new Date(event.occurredAt).getTime() + KST);
  return {
    label: labels[event.eventType],
    wish: transfer
      ? `${wishName(event.sourceWish)} → ${wishName(event.destinationWish)}`
      : "wish" in event
        ? wishName(event.wish)
        : null,
    amount: transfer
      ? `${money(event.amount)}원 이동`
      : `${delta > 0 ? "+" : delta < 0 ? "−" : ""}${money(Math.abs(delta))}원`,
    increasing: delta > 0,
    balance: `사용 가능 잔액 ${money(Math.max(0, event.accountAvailableBalanceAfter))}원`,
    shortage:
      event.accountAvailableBalanceAfter < 0
        ? `당시 부족 ${money(-event.accountAvailableBalanceAfter)}원`
        : null,
    month: `${local.getUTCFullYear()}년 ${local.getUTCMonth() + 1}월`,
    date: `${local.getUTCMonth() + 1}.${String(local.getUTCDate()).padStart(2, "0")} ${String(local.getUTCHours()).padStart(2, "0")}:${String(local.getUTCMinutes()).padStart(2, "0")}`,
  };
}
