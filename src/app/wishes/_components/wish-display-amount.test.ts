import { describe, expect, it } from "vitest";
import { toWishDisplayAmount } from "./wish-display-amount";

describe("위시 표시 금액", () => {
  it("진행중과 완료 위시는 현재 금액을 사용한다", () => {
    expect(
      toWishDisplayAmount({
        state: "IN_PROGRESS",
        amount: 7_000,
        abandonmentAmount: null,
      }),
    ).toBe(7_000);
    expect(
      toWishDisplayAmount({
        state: "COMPLETED",
        amount: 30_000,
        abandonmentAmount: null,
      }),
    ).toBe(30_000);
  });

  it("포기 위시는 현재 0원이 아니라 포기 직전 역사 금액을 사용한다", () => {
    expect(
      toWishDisplayAmount({
        state: "ABANDONED",
        amount: 0,
        abandonmentAmount: 12_000,
      }),
    ).toBe(12_000);
  });

  it("포기 직전 0원도 null과 구분해 표시한다", () => {
    expect(
      toWishDisplayAmount({
        state: "ABANDONED",
        amount: 0,
        abandonmentAmount: 0,
      }),
    ).toBe(0);
  });

  it("상태와 역사 금액의 잘못된 조합을 거절한다", () => {
    expect(() =>
      toWishDisplayAmount({
        state: "ABANDONED",
        amount: 0,
        abandonmentAmount: null,
      }),
    ).toThrow("ABANDONED Wish must have an abandonmentAmount");
    expect(() =>
      toWishDisplayAmount({
        state: "AMOUNT_REACHED",
        amount: 10_000,
        abandonmentAmount: 5_000,
      }),
    ).toThrow("Non-abandoned Wish must not have an abandonmentAmount");
  });
});
