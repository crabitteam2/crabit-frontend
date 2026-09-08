import type { components } from "@/lib/http/generated/crabit-backend";

type MonthlyRecap = components["schemas"]["MonthlyRecapResponse"];

const HIGHLIGHT_COUNT = 3;

const TAB_COUNT = 5;

/** 도형에 넣을 후보 문장을 응답에서 순서대로 모읍니다. */
export function collectHighlights(
  result: NonNullable<MonthlyRecap["result"]>,
): string[] {
  return [
    result.objectivePerformance.messageTotalSavings,
    result.objectivePerformance.messageCompletedCount,
    result.objectivePerformance.messageRateChange,
    result.patternAnalysis.messageWeekWeekday,
    result.patternAnalysis.messageRegularity,
    result.patternAnalysis.messageAvgAmount,
    result.groupComparison.messageHabit,
    result.groupComparison.messageAchievement,
    result.pacePrediction.messageDailyPace,
    result.pacePrediction.messageExpectedDate,
    result.pacePrediction.messageRequiredDaily,
  ].filter((message): message is string => message !== null);
}

/**
 * 후보에서 세 문장을 고릅니다.
 *
 * 같은 씨앗이면 항상 같은 문장이 같은 순서로 나와서 새로고침해도 흔들리지 않습니다.
 */
export function pickHighlights(candidates: readonly string[], seed: string) {
  const remaining = [...candidates];
  const picked: string[] = [];
  let hash = fnv1a(seed);

  while (picked.length < HIGHLIGHT_COUNT && remaining.length > 0) {
    hash = fnv1a(String(hash));
    picked.push(remaining.splice(hash % remaining.length, 1)[0]!);
  }

  return picked;
}

/** 고른 달을 뒤에서 두 번째에 두고 다섯 달을 만듭니다. */
export function toMonthTabs(
  year: number,
  month: number,
  toHref: (year: number, month: number) => string,
) {
  return Array.from({ length: TAB_COUNT }, (_, index) => {
    const offset = index - (TAB_COUNT - 2);
    const shifted = new Date(Date.UTC(year, month - 1 + offset, 1));
    const tabYear = shifted.getUTCFullYear();
    const tabMonth = shifted.getUTCMonth() + 1;
    const isCurrent = tabYear === year && tabMonth === month;

    return {
      label: `${tabMonth}월`,
      href: isCurrent ? null : toHref(tabYear, tabMonth),
    };
  });
}

/** 이름 뒤에 붙일 주격 조사를 고릅니다. */
export function toSubjectParticle(name: string) {
  const last = name.trim().at(-1) ?? "";
  const code = last.charCodeAt(0);
  if (Number.isNaN(code) || code < 0xac00 || code > 0xd7a3) return "는";
  return (code - 0xac00) % 28 === 0 ? "는" : "은";
}

/** 조회에 쓰는 `2026-08` 형식으로 달을 옮깁니다. */
export function shiftMonth(startDate: string, offset: number) {
  const [year, month] = startDate.split("-").map(Number) as [number, number];
  const shifted = new Date(Date.UTC(year, month - 1 + offset, 1));
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
}

function fnv1a(value: string) {
  let hash = 0x811c9dc5;
  for (const character of value) {
    hash ^= character.codePointAt(0)!;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
}
