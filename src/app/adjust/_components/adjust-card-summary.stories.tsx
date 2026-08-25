import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AdjustCardSummary } from "./adjust-card-summary";

const meta = {
  title: "Adjust/AdjustCardSummary",
  component: AdjustCardSummary,
  parameters: { layout: "padded" },
} satisfies Meta<typeof AdjustCardSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "아라의 크래빗 카드",
    balance: 20_000,
    shortage: 5_000,
    cardNumber: "0000-0000-0000-0000",
  },
};

export const 큰금액: Story = {
  args: {
    label: "아라의 크래빗 카드",
    balance: 1_250_000,
    shortage: 320_000,
    cardNumber: "0000-0000-0000-0000",
  },
};
