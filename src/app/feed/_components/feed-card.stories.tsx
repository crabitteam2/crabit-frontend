import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeedCard } from "./feed-card";

const meta = {
  title: "Feed/FeedCard",
  component: FeedCard,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FeedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 진행중: Story = {
  args: {
    href: "/feed/s1",
    card: {
      id: "f1",
      ownerId: "s1",
      ownerNickname: "선형",
      purpose: "여름 방학 캠프",
      targetAmount: 100_000,
      percent: 20,
      state: "IN_PROGRESS",
      startDate: "2026.08.24",
      targetDate: "2026.10.25",
    },
  },
};

export const 완료: Story = {
  args: {
    href: "/feed/s3",
    card: {
      id: "f3",
      ownerId: "s3",
      ownerNickname: "도윤",
      purpose: "스포츠카 레고",
      targetAmount: 45_000,
      percent: 100,
      state: "COMPLETED",
      startDate: "2026.01.05",
      targetDate: "2026.05.31",
    },
  },
};

export const 기간없음: Story = {
  args: {
    ...진행중.args,
    card: { ...진행중.args.card, startDate: null, targetDate: null },
  },
};
