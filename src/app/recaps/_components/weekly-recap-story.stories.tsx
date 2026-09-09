import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WEEKLY_RECAP_MOCK } from "@/lib/mock/weekly-recap";
import { WeeklyRecapStory } from "./weekly-recap-story";

const meta = {
  title: "Recaps/WeeklyRecapStory",
  component: WeeklyRecapStory,
  parameters: { layout: "fullscreen" },
  args: { closeHref: "/", feedHref: "/feed", ...WEEKLY_RECAP_MOCK },
} satisfies Meta<typeof WeeklyRecapStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};

export const 구경한_친구_없음: Story = {
  args: {
    growth: {
      headline: "내 위시리스트 조회수가 성장 가능성이 있어요.",
      description: `아직 내 위시리스트를 구경한 친구가 없어요 👀
효과적인 성장을 원한다면 매주 새로운 위시를 피드에
공유하는 것 부터 시작해보세요.`,
      nickname: "아라",
      totalVisits: 0,
      growthPct: null,
    },
  },
};

export const 완주한_친구_여럿: Story = {
  args: {
    stories: {
      headline: `지난주 우리학원의 위시를 달성한
친구들이 있어요.`,
      description: "불도저형 토끼 지원이가 '포켓몬 카드' 위시를 완주했어요!",
      cards: [
        ...WEEKLY_RECAP_MOCK.stories.cards,
        {
          id: "00000000-0000-0000-0000-000000000902",
          nickname: "선형",
          purpose: "무선 이어폰",
          period: "26.08.10 ~26.08.23",
        },
      ],
    },
  },
};
