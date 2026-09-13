import { describe, expect, it } from "vitest";
import {
  isCompletedMonth,
  pickHighlights,
  toMonthTabs,
  toSubjectParticle,
  toMonthlyRecapEmptyMessage,
} from "./monthly-recap-view";

const CANDIDATES = [
  "총 저축액",
  "완주 개수",
  "달성률 변화",
  "주차와 요일",
  "규칙성",
  "건당 규모",
];

describe("monthly recap status copy", () => {
  const now = new Date("2026-09-13T03:00:00Z");
  it("explains terminal ineligibility without promising a future report", () => {
    const message = toMonthlyRecapEmptyMessage(
      "NOT_ELIGIBLE",
      "2026-08-01",
      now,
    );
    expect(message).toContain("3건 미만");
    expect(message).not.toMatch(/아직|다시|9월 초/);
  });
  it("distinguishes generation, failure, ungenerated and unfinished periods", () => {
    expect(
      toMonthlyRecapEmptyMessage("GENERATING", "2026-08-01", now),
    ).toContain("만들고 있어요");
    expect(toMonthlyRecapEmptyMessage("FAILED", "2026-08-01", now)).toContain(
      "만들지 못했어요",
    );
    expect(toMonthlyRecapEmptyMessage("NOT_GENERATED", "2026-08-01", now)).toBe(
      "8월 리캡이 아직 준비되지 않았어요.",
    );
    expect(
      toMonthlyRecapEmptyMessage("NOT_GENERATED", "2026-09-01", now),
    ).toContain("한 달이 끝난 뒤");
  });
});

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

  it("고른 달이 속한 해의 열두 달을 만든다", () => {
    const tabs = toMonthTabs(2026, 7, href);

    expect(tabs).toHaveLength(12);
    expect(tabs[0]?.label).toBe("1월");
    expect(tabs[11]?.label).toBe("12월");
    expect(tabs[0]?.href).toBe("2026-1");
  });

  it("고른 달은 이동할 곳을 두지 않는다", () => {
    const tabs = toMonthTabs(2026, 2, href);

    expect(tabs[1]?.href).toBeNull();
    expect(tabs.filter((tab) => tab.href === null)).toHaveLength(1);
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
