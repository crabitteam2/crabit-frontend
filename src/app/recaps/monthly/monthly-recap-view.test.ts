import { describe, expect, it } from "vitest";
import {
  isCompletedMonth,
  pickHighlights,
  toMonthTabs,
  toSubjectParticle,
  toYearOptions,
} from "./monthly-recap-view";

const CANDIDATES = [
  "총 저축액",
  "완주 개수",
  "달성률 변화",
  "주차와 요일",
  "규칙성",
  "건당 규모",
];

describe("pickHighlights", () => {
  it("같은 씨앗이면 같은 문장을 같은 순서로 고른다", () => {
    const first = pickHighlights(CANDIDATES, "account:2026-08-01");
    const second = pickHighlights(CANDIDATES, "account:2026-08-01");

    expect(first).toHaveLength(3);
    expect(second).toEqual(first);
  });

  it("달이 바뀌면 다른 조합이 나온다", () => {
    const august = pickHighlights(CANDIDATES, "account:2026-08-01");
    const july = pickHighlights(CANDIDATES, "account:2026-07-01");

    expect(july).not.toEqual(august);
  });

  it("같은 문장을 두 번 고르지 않는다", () => {
    const picked = pickHighlights(CANDIDATES, "account:2026-08-01");

    expect(new Set(picked).size).toBe(picked.length);
  });

  it("후보가 세 개보다 적으면 있는 만큼만 고른다", () => {
    expect(pickHighlights(["하나", "둘"], "seed")).toHaveLength(2);
  });
});

describe("toMonthTabs", () => {
  const href = (year: number, month: number) => `${year}-${month}`;

  it("고른 달을 뒤에서 두 번째에 두고 다섯 달을 만든다", () => {
    const tabs = toMonthTabs(2026, 7, href);

    expect(tabs.map((tab) => tab.label)).toEqual([
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
    ]);
    expect(tabs[3]?.href).toBeNull();
  });

  it("해를 넘겨도 달을 이어서 만든다", () => {
    const tabs = toMonthTabs(2026, 2, href);

    expect(tabs.map((tab) => tab.label)).toEqual([
      "11월",
      "12월",
      "1월",
      "2월",
      "3월",
    ]);
    expect(tabs[0]?.href).toBe("2025-11");
  });
});

describe("toSubjectParticle", () => {
  it.each([
    ["아라", "는"],
    ["오너", "는"],
    ["박선형", "은"],
  ])("%s 뒤에 %s를 붙인다", (name, particle) => {
    expect(toSubjectParticle(name)).toBe(particle);
  });
});

describe("toYearOptions", () => {
  const months = ["2026-08", "2026-07", "2026-06", "2025-08"];

  it("리캡이 있는 해를 오래된 순으로 준다", () => {
    expect(toYearOptions(months, { year: 2026, month: 8 })).toEqual([
      { year: 2025, month: 8 },
      { year: 2026, month: 8 },
    ]);
  });

  it("보고 있는 해는 보고 있는 달로 간다", () => {
    expect(toYearOptions(months, { year: 2026, month: 6 }).at(-1)).toEqual({
      year: 2026,
      month: 6,
    });
  });

  it("리캡이 없는 해를 보고 있어도 그 해가 목록에 남는다", () => {
    expect(toYearOptions(months, { year: 2024, month: 3 })).toEqual([
      { year: 2024, month: 3 },
      { year: 2025, month: 8 },
      { year: 2026, month: 8 },
    ]);
  });

  it("리캡이 없으면 보고 있는 해만 준다", () => {
    expect(toYearOptions([], { year: 2026, month: 8 })).toEqual([
      { year: 2026, month: 8 },
    ]);
  });
});

describe("isCompletedMonth", () => {
  const now = new Date("2026-09-09T00:00:00Z");

  it("지난 달은 끝난 달이다", () => {
    expect(isCompletedMonth("2026-08", now)).toBe(true);
    expect(isCompletedMonth("2025-12", now)).toBe(true);
  });

  it("이번 달과 앞으로 올 달은 끝나지 않았다", () => {
    expect(isCompletedMonth("2026-09", now)).toBe(false);
    expect(isCompletedMonth("2026-10", now)).toBe(false);
    expect(isCompletedMonth("2027-01", now)).toBe(false);
  });

  it("서울 기준으로 해가 바뀌는 순간을 센다", () => {
    const newYearEve = new Date("2026-12-31T15:30:00Z");

    expect(isCompletedMonth("2026-12", newYearEve)).toBe(true);
    expect(isCompletedMonth("2027-01", newYearEve)).toBe(false);
  });
});
