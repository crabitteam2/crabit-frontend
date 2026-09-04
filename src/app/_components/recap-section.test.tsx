import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { components } from "@/lib/http/generated/crabit-backend";
import { RecapSection } from "./recap-section";

type Weekly = components["schemas"]["WeeklyRecapResponse"];
type Monthly = components["schemas"]["MonthlyRecapResponse"];

describe("RecapSection", () => {
  it("생성 전과 월간 부적격을 결과나 링크로 오해하지 않는다", () => {
    render(
      <RecapSection
        weekly={weeklyState("NOT_GENERATED")}
        monthly={monthlyState("NOT_ELIGIBLE")}
      />,
    );

    expect(
      screen.getByText("아직 주간 리플레이가 없어요."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("저축 기록이 3번 모이면 월간 리플레이가 열려요."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("생성 중과 실패를 서로 다른 상태로 안내한다", () => {
    render(
      <RecapSection
        weekly={weeklyState("GENERATING")}
        monthly={monthlyState("FAILED")}
      />,
    );

    expect(
      screen.getByText("주간 리플레이를 만들고 있어요."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("월간 리플레이를 불러오지 못했어요."),
    ).toBeInTheDocument();
  });

  it("활동이 0인 성공도 상세 링크가 있는 성공 리캡으로 표시한다", () => {
    render(
      <RecapSection weekly={weeklySucceeded()} monthly={monthlySucceeded()} />,
    );

    expect(screen.getByText("지난주는 조용히 쉬어갔어요.")).toBeInTheDocument();
    expect(screen.getByText("소액이라도 꾸준히 모았어요!")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "주간 리플레이 자세히 보기" }),
    ).toHaveAttribute("href", "/recaps/weekly?weekStart=2026-08-24");
    expect(
      screen.getByRole("link", { name: "월간 리플레이 자세히 보기" }),
    ).toHaveAttribute("href", "/recaps/monthly?month=2026-08");
  });
});

function weeklyState(
  status: "NOT_GENERATED" | "GENERATING" | "FAILED",
): Weekly {
  const version = status === "NOT_GENERATED" ? null : 1;
  return {
    kind: "WEEKLY",
    status,
    period: period("2026-08-24", "2026-08-31"),
    generationVersion: version,
    schemaVersion: 1,
    algorithmVersion: version === null ? null : "recap-1",
    generatedAt: null,
    result: null,
  };
}

function monthlyState(
  status: "NOT_GENERATED" | "GENERATING" | "NOT_ELIGIBLE" | "FAILED",
): Monthly {
  const version = status === "NOT_GENERATED" ? null : 1;
  return {
    kind: "MONTHLY",
    status,
    period: period("2026-08-01", "2026-09-01"),
    generationVersion: version,
    schemaVersion: 1,
    algorithmVersion: version === null ? null : "recap-1",
    generatedAt: status === "NOT_ELIGIBLE" ? "2026-09-01T00:10:00Z" : null,
    result: null,
  };
}

function weeklySucceeded(): Weekly {
  return {
    kind: "WEEKLY",
    status: "SUCCEEDED",
    period: period("2026-08-24", "2026-08-31"),
    generationVersion: 1,
    schemaVersion: 1,
    algorithmVersion: "recap-1",
    generatedAt: "2026-08-31T00:05:00Z",
    result: {
      period: { weekStart: "2026-08-24", weekEnd: "2026-08-30" },
      page1LastWeekPerformance: {
        achievement: {
          saveCount: 0,
          netSavings: 0,
          newWishCount: 0,
          message: "지난주는 조용히 쉬어갔어요.",
        },
        milestone: {
          wishTitle: null,
          rateBefore: null,
          rateAfter: null,
          message: null,
        },
        streak: { streakWeeks: 0, message: "새로운 스트릭을 시작해 보세요." },
      },
      page2GrowthReport: {
        totalVisits: 0,
        uniqueVisitors: 0,
        growthPct: null,
        messageVisits: "지난주엔 방문한 친구가 없었어요.",
        messageGrowth: null,
      },
      page3AcademySuccessStories: {
        messageSummary: "아직 성공 스토리가 없어요.",
        stories: [],
      },
    },
  };
}

function monthlySucceeded(): Monthly {
  return {
    kind: "MONTHLY",
    status: "SUCCEEDED",
    period: period("2026-08-01", "2026-09-01"),
    generationVersion: 1,
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
        totalSavings: 0,
        completedWishCount: 0,
        representativeWishTitle: null,
        prevRatePct: null,
        currRatePct: null,
        messageTotalSavings: "이번 달 저축은 0원이에요.",
        messageCompletedCount: "완주한 위시가 없어요.",
        messageRateChange: null,
      },
      patternAnalysis: {
        topWeek: null,
        topWeekday: null,
        messageWeekWeekday: "저축 기록이 충분하지 않아요.",
        messageRegularity: "저축 간격을 계산할 수 없어요.",
        messageAvgAmount: "평균 금액을 계산할 수 없어요.",
      },
      groupComparison: {
        habitPercentile: null,
        habitPercentileStatus: "no_peers",
        achievementPercentile: null,
        achievementPercentileStatus: null,
        messageHabit: "아직 비교할 친구가 없어요.",
        messageAchievement: null,
      },
      pacePrediction: {
        dailyPace: 0,
        expectedCompletionDate: null,
        requiredDailyAmount: null,
        messageDailyPace: "저축 속도는 하루 평균 0원이에요.",
        messageExpectedDate: null,
        messageRequiredDaily: null,
      },
    },
  };
}

function period(startDate: string, endDateExclusive: string) {
  return { startDate, endDateExclusive, timezone: "Asia/Seoul" as const };
}
