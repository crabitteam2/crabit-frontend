import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishSourceCard } from "./wish-source-card";

const meta = {
  title: "Wishes/WishSourceCard",
  component: WishSourceCard,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WishSourceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    wish: {
      id: "w1",
      purpose: "포켓몬 카드 부스터팩",
      amount: 12_000,
      targetAmount: 30_000,
      state: "IN_PROGRESS",
    },
  },
};

export const 선택됨: Story = {
  args: { ...Default.args, isSelected: true },
};
