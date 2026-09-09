import "server-only";

import type { components } from "@/lib/http/generated/crabit-backend";
import { getWeeklyRecap } from "@/lib/http/recaps";
import { unwrapResult } from "@/lib/http/result";
import { getAcademySharedCard } from "@/lib/http/shared-cards";
import type { ServerApiClient } from "@/lib/http/server";
import { NICKNAME } from "@/lib/mock/home";
import {
  fromIsoDate,
  toSavingPeriodLabel,
} from "@/app/wishes/_components/wish-period-format";
import { loadAccountContext } from "@/app/wishes/load-account";
import type { WeeklyRecapStoryCard } from "../_components/weekly-recap-stories";

type WeeklyRecap = components["schemas"]["WeeklyRecapResponse"];
type WeeklyRecapResult = NonNullable<WeeklyRecap["result"]>;
type SharedCard = components["schemas"]["SharedCard"];

const GROWTH_HEADLINE = "내 위시리스트 조회수가 성장 가능성이 있어요.";

const GROWTH_ADVICE =
  "효과적인 성장을 원한다면 매주 새로운 위시를 피드에 공유하는 것 부터 시작해보세요.";

const STORY_HEADLINE = `지난주 우리학원의 위시를 달성한
친구들이 있어요.`;

/** 주간 리캡 세 장이 그리는 데 필요한 값입니다. */
export interface WeeklyRecapView {
  savings: {
    headline: string;
    netSavings: number;
    newWishCount: number;
  };
  growth: {
    headline: string;
    description: string;
    nickname: string;
    totalVisits: number;
    growthPct: number | null;
  };
  stories: {
    headline: string;
    description: string;
    cards: WeeklyRecapStoryCard[];
  };
}

/**
 * 인증 학생의 완료 주 리캡을 조회하고 화면에 넣을 값으로 바꿉니다.
 *
 * 리캡이 아직 없으면 null입니다.
 */
export async function loadWeeklyRecapView(
  weekStart?: string,
): Promise<WeeklyRecapView | null> {
  const { client, cardBalanceAccountId, account } = await loadAccountContext();
  const recap = unwrapResult(
    await getWeeklyRecap(client, { cardBalanceAccountId, weekStart }),
  );
  if (recap.status !== "SUCCEEDED" || recap.result === null) return null;

  const cards = await loadStoryCards(client, account.academyId, recap.result);

  return {
    savings: toSavings(recap.result),
    growth: toGrowth(recap.result),
    stories: {
      headline: STORY_HEADLINE,
      description: toStoryDescription(recap.result, cards),
      cards,
    },
  };
}

function toSavings(result: WeeklyRecapResult) {
  const { achievement, streak } = result.page1LastWeekPerformance;

  return {
    headline: `${achievement.message}\n${streak.message}`,
    netSavings: achievement.netSavings,
    newWishCount: achievement.newWishCount,
  };
}

function toGrowth(result: WeeklyRecapResult) {
  const report = result.page2GrowthReport;

  return {
    headline: GROWTH_HEADLINE,
    description: `${report.messageVisits} ${GROWTH_ADVICE}`,
    nickname: NICKNAME,
    totalVisits: report.totalVisits,
    growthPct: report.growthPct,
  };
}

/**
 * 완주 소식에 쓸 공유 카드를 한 장씩 조회합니다.
 *
 * 리캡은 카드 식별자만 주고 이름과 기간은 주지 않습니다.
 * 이미 내려간 카드는 조회에 실패하므로 그 카드는 빼고 그립니다.
 */
async function loadStoryCards(
  client: ServerApiClient,
  academyId: string,
  result: WeeklyRecapResult,
): Promise<WeeklyRecapStoryCard[]> {
  const results = await Promise.all(
    result.page3AcademySuccessStories.stories.map((story) =>
      getAcademySharedCard(client, {
        academyId,
        cardId: story.sharedCardId,
      }),
    ),
  );

  return results
    .filter((one) => one.ok)
    .map((one) => toStoryCard(one.data))
    .filter((card): card is WeeklyRecapStoryCard => card !== null);
}

function toStoryCard(card: SharedCard): WeeklyRecapStoryCard | null {
  if (card.kind !== "COMPLETION") return null;

  return {
    id: card.sharedCardId,
    nickname: card.ownerNickname,
    purpose: card.purpose,
    period: toSavingPeriodLabel({
      start: fromIsoDate(card.startDate),
      end: fromIsoDate(card.targetDate),
    }),
  };
}

function toStoryDescription(
  result: WeeklyRecapResult,
  cards: readonly WeeklyRecapStoryCard[],
) {
  const [story] = result.page3AcademySuccessStories.stories;
  const [card] = cards;
  if (story === undefined || card === undefined)
    return result.page3AcademySuccessStories.messageSummary;

  const type = story.typeTitle === null ? "" : `${story.typeTitle} `;
  return `${type}${card.nickname}이가 '${card.purpose}' 위시를 완주했어요!`;
}
