import { describe, expect, it } from "vitest";
import {
  recentThreeMonthBounds,
  movementPresentation,
  type FundMovement,
} from "./history-model";

describe("historical account movement presentation", () => {
  it("freezes three calendar months at KST midnight and clamps month end", () => {
    expect(recentThreeMonthBounds(new Date("2026-09-16T16:00:00Z"))).toEqual({
      from: "2026-06-16T15:00:00.000Z",
      to: "2026-09-17T15:00:00.000Z",
    });
    expect(recentThreeMonthBounds(new Date("2026-05-31T00:00:00Z"))).toEqual({
      from: "2026-02-27T15:00:00.000Z",
      to: "2026-05-31T15:00:00.000Z",
    });
  });
  it("preserves historical deficit separately from clamped available balance", () => {
    const view = movementPresentation({
      eventType: "CARD_BALANCE_CHANGE",
      accountAvailableBalanceDelta: -5000,
      accountAvailableBalanceAfter: -2000,
      occurredAt: "2026-08-31T15:01:00Z",
    } as FundMovement);
    expect(view).toMatchObject({
      amount: "−5,000원",
      balance: "사용 가능 잔액 0원",
      shortage: "당시 부족 2,000원",
      month: "2026년 9월",
      date: "9.01 00:01",
    });
  });
  it("shows one unsigned transfer and both historical names even when deleted", () => {
    const view = movementPresentation({
      eventType: "WISH_TRANSFER",
      accountAvailableBalanceDelta: 0,
      accountAvailableBalanceAfter: 22000,
      amount: 2000,
      sourceWish: { wishPurposeSnapshot: "자전거", deletedWish: true },
      destinationWish: { wishPurposeSnapshot: "운동화", deletedWish: false },
      occurredAt: "2026-09-01T00:00:00Z",
    } as FundMovement);
    expect(view).toMatchObject({
      amount: "2,000원 이동",
      wish: "자전거 (삭제된 위시) → 운동화",
      balance: "사용 가능 잔액 22,000원",
      increasing: false,
    });
  });
  it.each([
    ["WISH_DEPOSIT", -5000, "위시 넣기", "−5,000원"],
    ["WISH_WITHDRAWAL", 5000, "위시 빼기", "+5,000원"],
    ["WISH_COMPLETION_RETURN", 5000, "위시 완료 반환", "+5,000원"],
    ["WISH_ABANDONMENT_RETURN", 5000, "위시 포기 반환", "+5,000원"],
    ["WISH_DELETION_RETURN", 5000, "위시 삭제 반환", "+5,000원"],
  ])(
    "uses account direction for %s",
    (eventType, accountAvailableBalanceDelta, label, amount) => {
      expect(
        movementPresentation({
          eventType,
          accountAvailableBalanceDelta,
          accountAvailableBalanceAfter: 25000,
          occurredAt: "2026-09-01T00:00:00Z",
          wish: { wishPurposeSnapshot: "옛 이름", deletedWish: false },
        } as FundMovement),
      ).toMatchObject({
        label,
        amount,
        balance: "사용 가능 잔액 25,000원",
        wish: "옛 이름",
      });
    },
  );
});
