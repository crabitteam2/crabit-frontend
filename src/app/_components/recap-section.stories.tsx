import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { components } from "@/lib/http/generated/crabit-backend";
import { RecapSection } from "./recap-section";

const weeklySucceeded: components["schemas"]["WeeklyRecapResponse"] = {
  kind: "WEEKLY",
  status: "SUCCEEDED",
  period: period("2026-08-24", "2026-08-31"),
  generationVersion: 3,
  schemaVersion: 1,
  algorithmVersion: "recap-1",
  generatedAt: "2026-08-31T00:05:00Z",
  result: {
    period: { weekStart: "2026-08-24", weekEnd: "2026-08-30" },
    page1LastWeekPerformance: {
      achievement: {
        saveCount: 3,
        netSavings: 42_000,
        newWishCount: 1,
        message: "지난주에 3번 저축 · 새 위시 1개 등록했어요!",
      },
      milestone: {
        wishTitle: "새 자전거",
        rateBefore: 45,
        rateAfter: 58,
        message: "대표 위시가 50% 지점을 돌파했어요!",
      },
      streak: { streakWeeks: 4, message: "4주 연속 저축 중이에요!" },
    },
    page2GrowthReport: {
      totalVisits: 8,
      uniqueVisitors: 3,
      growthPct: 60,
      messageVisits: "지난주 3명이 8번 방문했어요.",
      messageGrowth: "지난주보다 방문이 60% 늘었어요.",
    },
    page3AcademySuccessStories: {
      messageSummary: "친구 1명이 목표를 이뤘어요!",
      stories: [],
    },
  },
};

const monthlySucceeded: components["schemas"]["MonthlyRecapResponse"] = {
  kind: "MONTHLY",
  status: "SUCCEEDED",
  period: period("2026-08-01", "2026-09-01"),
  generationVersion: 2,
  schemaVersion: 1,
  algorithmVersion: "recap-1",
  generatedAt: "2026-09-01T00:10:00Z",
  result: {
    period: { year: 2026, month: 8 },
    isActive: true,
    typeSection: {
      typeTitle: "꾸준형 토끼",
      message: "소액이라도 꾸준히 모았어요!",
    },
    objectivePerformance: {
      totalSavings: 90_000,
      completedWishCount: 0,
      representativeWishTitle: "새 자전거",
      prevRatePct: 30,
      currRatePct: 45,
      messageTotalSavings: "이번 달 총 90,000원을 모았어요.",
      messageCompletedCount: "이번 달엔 아직 완주한 위시가 없어요.",
      messageRateChange: "대표 위시가 30%에서 45%로 변했어요.",
    },
    patternAnalysis: {
      topWeek: 2,
      topWeekday: "금요일",
      messageWeekWeekday: "2주차 금요일에 가장 많이 저축했어요.",
      messageRegularity: "일정한 간격으로 저축했어요.",
      messageAvgAmount: "한 번에 평균 30,000원씩 모았어요.",
    },
    groupComparison: {
      habitPercentile: null,
      habitPercentileStatus: "no_peers",
      achievementPercentile: null,
      achievementPercentileStatus: "all_tied",
      messageHabit: "아직 비교할 친구가 없어요.",
      messageAchievement: "친구들과 목표 달성률이 동점이에요.",
    },
    pacePrediction: {
      dailyPace: 2903.2,
      expectedCompletionDate: null,
      requiredDailyAmount: null,
      messageDailyPace: "하루 평균 2,903원씩 모으는 속도예요.",
      messageExpectedDate: null,
      messageRequiredDaily: null,
    },
  },
};

const meta = {
  title: "Home/RecapSection",
  component: RecapSection,
  parameters: { layout: "padded" },
  args: { weekly: weeklySucceeded, monthly: monthlySucceeded },
} satisfies Meta<typeof RecapSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Succeeded: Story = {};

export const GeneratingAndNotEligible: Story = {
  args: {
    weekly: state("WEEKLY", "GENERATING", "2026-08-24", "2026-08-31", 1),
    monthly: state("MONTHLY", "NOT_ELIGIBLE", "2026-08-01", "2026-09-01", 1),
  },
};

export const NotGeneratedAndFailed: Story = {
  args: {
    weekly: state("WEEKLY", "NOT_GENERATED", "2026-08-24", "2026-08-31"),
    monthly: state("MONTHLY", "FAILED", "2026-08-01", "2026-09-01", 1),
  },
};

function period(startDate: string, endDateExclusive: string) {
  return { startDate, endDateExclusive, timezone: "Asia/Seoul" as const };
}

function state(
  kind: "WEEKLY",
  status: "NOT_GENERATED" | "GENERATING" | "FAILED",
  startDate: string,
  endDateExclusive: string,
  version?: number,
): components["schemas"]["WeeklyRecapResponse"];
function state(
  kind: "MONTHLY",
  status: "NOT_GENERATED" | "GENERATING" | "NOT_ELIGIBLE" | "FAILED",
  startDate: string,
  endDateExclusive: string,
  version?: number,
): components["schemas"]["MonthlyRecapResponse"];
function state(
  kind: "WEEKLY" | "MONTHLY",
  status: "NOT_GENERATED" | "GENERATING" | "NOT_ELIGIBLE" | "FAILED",
  startDate: string,
  endDateExclusive: string,
  version?: number,
):
  | components["schemas"]["WeeklyRecapResponse"]
  | components["schemas"]["MonthlyRecapResponse"] {
  return {
    kind,
    status,
    period: period(startDate, endDateExclusive),
    generationVersion: version ?? null,
    schemaVersion: 1,
    algorithmVersion: version === undefined ? null : "recap-1",
    generatedAt: status === "NOT_ELIGIBLE" ? "2026-09-01T00:10:00Z" : null,
    result: null,
  } as
    | components["schemas"]["WeeklyRecapResponse"]
    | components["schemas"]["MonthlyRecapResponse"];
}
