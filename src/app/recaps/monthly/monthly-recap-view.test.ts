import { describe, expect, it } from "vitest";
import {
  pickHighlights,
  toMonthTabs,
  toSubjectParticle,
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
