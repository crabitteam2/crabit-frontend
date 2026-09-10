import { beforeEach, describe, expect, it, vi } from "vitest";

const listMyCardBalanceAccounts = vi.fn();
const getWeeklyRecap = vi.fn();
const getAcademySharedCard = vi.fn();

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/http/server", () => ({ createServerApiClient: () => ({}) }));
vi.mock("@/lib/http/card-balance-accounts", () => ({
  listMyCardBalanceAccounts: (...args: unknown[]) =>
    listMyCardBalanceAccounts(...args),
}));
vi.mock("@/lib/http/recaps", () => ({
  getWeeklyRecap: (...args: unknown[]) => getWeeklyRecap(...args),
}));
vi.mock("@/lib/http/shared-cards", () => ({
  getAcademySharedCard: (...args: unknown[]) => getAcademySharedCard(...args),
}));

const { loadWeeklyRecapView } = await import("./load-weekly-recap");

const accountId = "11111111-1111-4111-8111-111111111111";
const academyId = "00000000-0000-0000-0000-000000000101";
const cardId = "33333333-3333-4333-8333-333333333333";

const result = {
  period: { weekStart: "2026-08-24", weekEnd: "2026-08-30" },
  page1LastWeekPerformance: {
    achievement: {
      saveCount: 3,
      netSavings: 42_000,
      newWishCount: 1,
      message: "지난주에 3번 저축했어요.",
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
    messageSummary: "학원 친구 1명이 목표를 이뤘어요!",
    stories: [
      {
        wishId: "11111111-1111-4111-8111-111111111112",
        typeTitle: "꾸준형 토끼",
        ownerStudentId: "22222222-2222-4222-8222-222222222222",
        sharedCardId: cardId,
      },
    ],
  },
};

function recap(status: string, withResult = true) {
  return {
    ok: true,
    data: {
      kind: "WEEKLY",
      status,
      period: {
        startDate: "2026-08-24",
        endDateExclusive: "2026-08-31",
        timezone: "Asia/Seoul",
      },
      schemaVersion: 1,
      algorithmVersion: "recap-1",
      generationVersion: 1,
      generatedAt: "2026-08-31T00:05:00Z",
      result: withResult ? result : null,
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  listMyCardBalanceAccounts.mockResolvedValue({
    ok: true,
    data: {
      items: [
        { cardBalanceAccountId: accountId, academyId, unresolvedShortage: 0 },
      ],
      nextCursor: null,
    },
  });
  getWeeklyRecap.mockResolvedValue(recap("SUCCEEDED"));
  getAcademySharedCard.mockResolvedValue({
    ok: true,
    data: {
      kind: "COMPLETION",
      sharedCardId: cardId,
      ownerId: "22222222-2222-4222-8222-222222222222",
      ownerNickname: "지원",
      purpose: "포켓몬 카드",
      startDate: "2026-08-24",
      targetDate: "2026-08-25",
      progressPercent: 100,
    },
  });
});

describe("주간 리캡 화면 값", () => {
  it("첫 장은 받은 문구를 줄바꿈으로 잇는다", async () => {
    const view = await loadWeeklyRecapView();

    expect(view?.savings).toEqual({
      headline:
        "지난주에 3번 저축했어요.\n4주 연속 저축 중이에요!\n대표 위시가 50% 지점을 돌파했어요!",
      netSavings: 42_000,
      newWishCount: 1,
    });
  });

  it("둘째 장은 성장 문구를 제목, 방문 문구를 설명으로 쓴다", async () => {
    const view = await loadWeeklyRecapView();

    expect(view?.growth.headline).toBe("지난주보다 방문이 60% 늘었어요.");
    expect(view?.growth.description).toBe("지난주 3명이 8번 방문했어요.");
    expect(view?.growth.totalVisits).toBe(8);
    expect(view?.growth.growthPct).toBe(60);
  });

  it("성장 문구가 없으면 방문 문구를 제목으로 올린다", async () => {
    getWeeklyRecap.mockResolvedValue({
      ok: true,
      data: {
        ...recap("SUCCEEDED").data,
        result: {
          ...result,
          page2GrowthReport: {
            ...result.page2GrowthReport,
            growthPct: null,
            messageGrowth: null,
          },
        },
      },
    });

    const view = await loadWeeklyRecapView();

    expect(view?.growth.headline).toBe("지난주 3명이 8번 방문했어요.");
    expect(view?.growth.description).toBe("");
  });

  it("셋째 장은 공유 카드에서 이름과 기간을 채운다", async () => {
    const view = await loadWeeklyRecapView();

    expect(view?.stories.cards).toEqual([
      {
        id: cardId,
        nickname: "지원",
        purpose: "포켓몬 카드",
        period: "26.08.24 ~ 26.08.25",
      },
    ]);
    expect(view?.stories.headline).toBe("학원 친구 1명이 목표를 이뤘어요!");
    expect(view?.stories.description).toBe(
      "꾸준형 토끼 지원이가 '포켓몬 카드' 위시를 완주했어요!",
    );
  });

  it("완주한 친구가 여럿이면 설명을 비운다", async () => {
    getWeeklyRecap.mockResolvedValue({
      ok: true,
      data: {
        ...recap("SUCCEEDED").data,
        result: {
          ...result,
          page3AcademySuccessStories: {
            messageSummary: "학원 친구 2명이 목표를 이뤘어요!",
            stories: [
              result.page3AcademySuccessStories.stories[0],
              {
                ...result.page3AcademySuccessStories.stories[0],
                sharedCardId: "44444444-4444-4444-8444-444444444444",
              },
            ],
          },
        },
      },
    });

    const view = await loadWeeklyRecapView();

    expect(view?.stories.cards).toHaveLength(2);
    expect(view?.stories.description).toBe("");
  });

  it("내려간 공유 카드는 빼고 그린다", async () => {
    getAcademySharedCard.mockResolvedValue({
      ok: false,
      error: { code: "SHARED_CARD_NOT_FOUND" },
    });

    const view = await loadWeeklyRecapView();

    expect(view?.stories.cards).toEqual([]);
    expect(view?.stories.headline).toBe("학원 친구 1명이 목표를 이뤘어요!");
    expect(view?.stories.description).toBe("");
  });

  it("리캡이 아직 없으면 null이다", async () => {
    getWeeklyRecap.mockResolvedValue(recap("NOT_GENERATED", false));

    await expect(loadWeeklyRecapView()).resolves.toBeNull();
  });
});
