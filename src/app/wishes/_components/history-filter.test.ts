import { describe, expect, it } from "vitest";

import { filterMovements } from "./history-filter";
import type { FundMovementItem } from "./wish-detail";

const now = new Date("2026-08-31T12:00:00+09:00");

function movement(id: string, occurredAt: string): FundMovementItem {
  return {
    id,
    occurredAt: new Date(occurredAt),
    kind: "DEPOSIT",
    amount: 1_000,
    balanceAfter: 1_000,
  };
}

const movements = [
  movement("이번달", "2026-08-10T00:00:00+09:00"),
  movement("두달전", "2026-06-20T00:00:00+09:00"),
  movement("다섯달전", "2026-03-20T00:00:00+09:00"),
  movement("작년", "2025-05-20T00:00:00+09:00"),
];

describe("저축 기록 필터", () => {
  it.each([
    { period: "이번달" as const, expected: ["이번달"] },
    { period: "3개월" as const, expected: ["이번달", "두달전"] },
    { period: "6개월" as const, expected: ["이번달", "두달전", "다섯달전"] },
    {
      period: "1년" as const,
      expected: ["이번달", "두달전", "다섯달전"],
    },
  ])("$period 조회 기간을 적용한다", ({ period, expected }) => {
    const visible = filterMovements(movements, period, "최신순", now);
    expect(visible.map((item) => item.id)).toEqual(expected);
  });

  it("과거순은 오래된 기록부터 보여준다", () => {
    const visible = filterMovements(movements, "1년", "과거순", now);
    expect(visible.map((item) => item.id)).toEqual([
      "다섯달전",
      "두달전",
      "이번달",
    ]);
  });

  it("원본 배열을 바꾸지 않는다", () => {
    const original = [...movements];
    filterMovements(movements, "1년", "과거순", now);
    expect(movements).toEqual(original);
  });
});
