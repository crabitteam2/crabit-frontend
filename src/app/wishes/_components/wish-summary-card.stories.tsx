import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishSummaryCard } from "./wish-summary-card";

const meta = {
  title: "Wishes/WishSummaryCard",
  component: WishSummaryCard,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WishSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    wish: {
      id: "w3",
      purpose: "시나모롤 인형",
      amount: 4_500,
      abandonmentAmount: null,
      targetAmount: 30_000,
      state: "IN_PROGRESS",
      visibility: "PRIVATE",
      version: 3,
      startDate: "26.08.24",
      targetDate: "26.10.25",
    },
  },
};

export const 포기: Story = {
  args: {
    wish: {
      id: "w4",
      purpose: "놀이공원 자유이용권",
      amount: 0,
      abandonmentAmount: 12_000,
      targetAmount: 55_000,
      state: "ABANDONED",
      visibility: "PRIVATE",
      version: 3,
      startDate: "26.04.01",
      targetDate: "26.07.31",
    },
  },
};

export const 포기_0원: Story = {
  args: {
    wish: {
      ...포기.args!.wish,
      id: "w5",
      abandonmentAmount: 0,
    },
  },
};

export const 사진: Story = {
  args: {
    wish: {
      id: "w5",
      purpose: "위시 텍스트 입력칸",
      amount: 20_000,
      abandonmentAmount: null,
      targetAmount: 100_000,
      state: "IN_PROGRESS",
      visibility: "PRIVATE",
      version: 1,
      startDate: "26.08.24",
      targetDate: "26.08.25",
      imageUrl: "/images/feed/empty.png",
    },
  },
};

export const 사진_기간없음: Story = {
  args: {
    wish: {
      id: "w6",
      purpose: "볼펜",
      amount: 930,
      abandonmentAmount: null,
      targetAmount: 5_000,
      state: "IN_PROGRESS",
      visibility: "PRIVATE",
      version: 1,
      startDate: "",
      targetDate: "",
      imageUrl: "/images/feed/empty.png",
    },
  },
};
