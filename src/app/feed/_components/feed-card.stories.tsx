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
    card: {
      id: "f1",
      studentId: "s1",
      ownerNickname: "선형",
      wish: {
        id: "fw1",
        purpose: "여름 방학 캠프",
        amount: 20_000,
        targetAmount: 100_000,
        state: "IN_PROGRESS",
        startDate: "26.08.24",
        targetDate: "26.10.25",
      },
    },
  },
};

export const 완료: Story = {
  args: {
    card: {
      id: "f3",
      studentId: "s3",
      ownerNickname: "도윤",
      wish: {
        id: "fw3",
        purpose: "스포츠카 레고",
        amount: 45_000,
        targetAmount: 45_000,
        state: "COMPLETED",
        startDate: "26.01.05",
        targetDate: "26.05.31",
      },
    },
  },
};
