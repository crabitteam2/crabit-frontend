import { describe, expect, it } from "vitest";
import {
  fromIsoDate,
  fromPeriodLabel,
  toFullDate,
  toIsoDate,
  toPeriodLabel,
  toPeriodParams,
  toSavingPeriodLabel,
  toShortDate,
} from "./wish-period-format";

describe("toShortDate", () => {
  it("연도를 두 자리로 줄인다", () => {
    expect(toShortDate("2026.08.21")).toBe("26.08.21");
  });

  it("이미 두 자리면 그대로 둔다", () => {
    expect(toShortDate("26.08.21")).toBe("26.08.21");
  });
});

describe("toFullDate", () => {
  it("두 자리 연도를 네 자리로 늘린다", () => {
    expect(toFullDate("26.08.21")).toBe("2026.08.21");
  });

  it("이미 네 자리면 그대로 둔다", () => {
    expect(toFullDate("2026.08.21")).toBe("2026.08.21");
  });
});

describe("fromPeriodLabel", () => {
  it("빈 값과 null은 선택 없음이다", () => {
    expect(fromPeriodLabel(null)).toEqual({ start: null, end: null });
    expect(fromPeriodLabel("")).toEqual({ start: null, end: null });
  });

  it("하루만 있으면 시작일만 채운다", () => {
    expect(fromPeriodLabel("26.08.21")).toEqual({
      start: "2026.08.21",
      end: null,
    });
  });

  it("범위를 달력 키로 되돌린다", () => {
    expect(fromPeriodLabel("26.08.21 - 26.08.27")).toEqual({
      start: "2026.08.21",
      end: "2026.08.27",
    });
  });

  it("표시 문자열과 기간이 서로 왕복한다", () => {
    const label = "26.06.01 - 26.10.31";
    expect(toPeriodLabel(fromPeriodLabel(label))).toBe(label);
  });
});

describe("toPeriodLabel", () => {
  it("아무것도 고르지 않으면 빈 문자열이다", () => {
    expect(toPeriodLabel({ start: null, end: null })).toBe("");
  });

  it("시작일만 고르면 하루만 표시한다", () => {
    expect(toPeriodLabel({ start: "2026.08.21", end: null })).toBe("26.08.21");
  });

  it("범위를 고르면 하이픈으로 잇는다", () => {
    expect(toPeriodLabel({ start: "2026.08.21", end: "2026.08.27" })).toBe(
      "26.08.21 - 26.08.27",
    );
  });

  it("해를 넘기는 범위도 이어 붙인다", () => {
    expect(toPeriodLabel({ start: "2026.12.28", end: "2027.01.03" })).toBe(
      "26.12.28 - 27.01.03",
    );
  });
});

describe("toSavingPeriodLabel", () => {
  it("저축 기간은 물결표로 잇는다", () => {
    expect(
      toSavingPeriodLabel({ start: "2026.08.24", end: "2026.08.25" }),
    ).toBe("26.08.24 ~ 26.08.25");
  });

  it("목표 기간의 하이픈 형식과 구분된다", () => {
    const range = { start: "2026.08.24", end: "2026.08.25" };
    expect(toSavingPeriodLabel(range)).not.toBe(toPeriodLabel(range));
  });

  it("고르지 않으면 빈 문자열이다", () => {
    expect(toSavingPeriodLabel({ start: null, end: null })).toBe("");
  });
});

describe("toPeriodParams", () => {
  it("고르지 않으면 쿼리가 비어 있다", () => {
    expect(toPeriodParams({ start: null, end: null }).toString()).toBe("");
  });

  it("시작일만 고르면 startDate만 담는다", () => {
    expect(
      toPeriodParams({ start: "2026.08.21", end: null }).get("startDate"),
    ).toBe("2026-08-21");
    expect(
      toPeriodParams({ start: "2026.08.21", end: null }).has("targetDate"),
    ).toBe(false);
  });

  it("범위를 고르면 둘 다 담는다", () => {
    const params = toPeriodParams({ start: "2026.08.21", end: "2026.08.27" });
    expect(params.get("startDate")).toBe("2026-08-21");
    expect(params.get("targetDate")).toBe("2026-08-27");
  });
});

describe("toIsoDate", () => {
  it("달력 키를 ISO 날짜로 바꾼다", () => {
    expect(toIsoDate("2026.09.05")).toBe("2026-09-05");
  });

  it("형식이 다르거나 값이 없으면 null이다", () => {
    expect(toIsoDate("26.09.05")).toBeNull();
    expect(toIsoDate("2026-09-05")).toBeNull();
    expect(toIsoDate(null)).toBeNull();
    expect(toIsoDate(undefined)).toBeNull();
  });
});

describe("fromIsoDate", () => {
  it("ISO 날짜를 달력 키로 바꾼다", () => {
    expect(fromIsoDate("2026-09-05")).toBe("2026.09.05");
  });

  it("형식이 다르거나 값이 없으면 null이다", () => {
    expect(fromIsoDate("2026.09.05")).toBeNull();
    expect(fromIsoDate(null)).toBeNull();
    expect(fromIsoDate(undefined)).toBeNull();
  });
});
