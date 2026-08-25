import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DepositDoneScreen } from "./deposit-done-screen";

const meta = {
  title: "Wishes/DepositDoneScreen",
  component: DepositDoneScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DepositDoneScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { amount: 5_000 } };

export const 큰금액: Story = { args: { amount: 120_000 } };
