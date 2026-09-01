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
      targetAmount: 30_000,
      state: "IN_PROGRESS",
      version: 3,
      startDate: "26.08.24",
      targetDate: "26.10.25",
    },
  },
};
