import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WithdrawDoneScreen } from "./withdraw-done-screen";

const meta = {
  title: "Wishes/WithdrawDoneScreen",
  component: WithdrawDoneScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WithdrawDoneScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { purpose: "시나모롤 인형", amount: 2_000, balanceAfter: 2_500 },
};

export const 전액출금: Story = {
  args: { purpose: "시나모롤 인형", amount: 4_500, balanceAfter: 0 },
};

export const 긴위시이름: Story = {
  args: {
    purpose: "산리오 캐릭터즈 대형 인형 세트 한정판",
    amount: 20_000,
    balanceAfter: 30_000,
  },
};
