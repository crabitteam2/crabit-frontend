import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardBalanceCard } from "./card-balance-card";

const meta = {
  title: "Wishes/CardBalanceCard",
  component: CardBalanceCard,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CardBalanceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "크래빗 카드 사용가능 금액",
    cardNumber: "0000-0000-0000-0000",
    balance: 20_000,
  },
};

export const 선택됨: Story = {
  args: { ...Default.args, isSelected: true },
};

export const 잔액을모름: Story = {
  args: { ...Default.args, balance: null },
};
