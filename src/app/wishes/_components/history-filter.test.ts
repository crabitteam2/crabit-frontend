import { describe, expect, it } from "vitest";

import { filterMovements } from "./history-filter";
import type { FundMovementItem } from "./wish-detail";

const now = new Date("2026-08-31T12:00:00+09:00");

function movement(
  id: string,
  occurredAt: string,
  extra: Partial<FundMovementItem> = {},
): FundMovementItem {
  return {
    id,
    occurredAt: new Date(occurredAt),
    kind: "DEPOSIT",
    amount: 1_000,
    balanceAfter: 1_000,
    isAdjustment: false,
    ...extra,
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
    const visible = filterMovements(movements, period, "최신순", null, now);
    expect(visible.map((item) => item.id)).toEqual(expected);
  });

  it("과거순은 오래된 기록부터 보여준다", () => {
    const visible = filterMovements(movements, "1년", "과거순", null, now);
    expect(visible.map((item) => item.id)).toEqual([
      "다섯달전",
      "두달전",
      "이번달",
    ]);
  });

  it("원본 배열을 바꾸지 않는다", () => {
    const original = [...movements];
    filterMovements(movements, "1년", "과거순", null, now);
    expect(movements).toEqual(original);
  });
});

describe("기록 종류 찾기", () => {
  const byKind = [
    movement("넣은 돈", "2026-08-10T00:00:00+09:00"),
    movement("꺼낸 돈", "2026-08-11T00:00:00+09:00", { kind: "WITHDRAWAL" }),
    movement("잔액 조정", "2026-08-12T00:00:00+09:00", {
      kind: "WITHDRAWAL",
      isAdjustment: true,
    }),
  ];

  it.each([
    { kind: "넣은 돈" as const },
    { kind: "꺼낸 돈" as const },
    { kind: "잔액 조정" as const },
  ])("$kind 기록만 남긴다", ({ kind }) => {
    const visible = filterMovements(byKind, "1년", "최신순", kind, now);
    expect(visible.map((item) => item.id)).toEqual([kind]);
  });

  it("고른 종류가 없으면 모든 기록을 보여준다", () => {
    const visible = filterMovements(byKind, "1년", "과거순", null, now);
    expect(visible.map((item) => item.id)).toEqual([
      "넣은 돈",
      "꺼낸 돈",
      "잔액 조정",
    ]);
  });
});
