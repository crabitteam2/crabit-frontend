import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WeeklyRecapStory } from "./weekly-recap-story";

const meta = {
  title: "Recaps/WeeklyRecapStory",
  component: WeeklyRecapStory,
  parameters: { layout: "fullscreen" },
  args: {
    closeHref: "/",
    feedHref: "/feed",
    savings: {
      headline: `지난주에 3번 저축 · 새 위시 1개 등록했어요!
4주 연속 저축 스트릭 유지 중이에요!
대표 위시가 50% 지점을 돌파했어요!`,
      netSavings: 42_000,
      newWishCount: 1,
    },
    growth: {
      headline: "지난주보다 방문이 60% 늘었어요.",
      description: "지난주 3명이 8번 방문했어요.",
      nickname: "아라",
      totalVisits: 8,
      growthPct: 60,
    },
    stories: {
      headline: "현재 볼 수 있는 학원 친구 1명이 목표를 이뤘어요!",
      description: "꾸준형 토끼 지원이가 '포켓몬 카드' 위시를 완주했어요!",
      cards: [
        {
          id: "00000000-0000-0000-0000-000000000901",
          nickname: "지원",
          purpose: "포켓몬 카드",
          period: "26.08.24 ~ 26.08.25",
        },
      ],
    },
  },
} satisfies Meta<typeof WeeklyRecapStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};

export const 성장_문구_없음: Story = {
  args: {
    growth: {
      headline: "아직 내 위시리스트를 구경한 친구가 없어요.",
      description: "",
      nickname: "아라",
      totalVisits: 0,
      growthPct: null,
    },
  },
};

export const 완주한_친구_여럿: Story = {
  args: {
    stories: {
      headline: "현재 볼 수 있는 학원 친구 2명이 목표를 이뤘어요!",
      description: "꾸준형 토끼 지원이가 '포켓몬 카드' 위시를 완주했어요!",
      cards: [
        {
          id: "00000000-0000-0000-0000-000000000901",
          nickname: "지원",
          purpose: "포켓몬 카드",
          period: "26.08.24 ~ 26.08.25",
        },
        {
          id: "00000000-0000-0000-0000-000000000902",
          nickname: "선형",
          purpose: "무선 이어폰",
          period: "26.08.10 ~ 26.08.23",
        },
      ],
    },
  },
};
