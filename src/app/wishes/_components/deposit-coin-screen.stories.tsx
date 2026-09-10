import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DepositCoinScreen } from "./deposit-coin-screen";

const meta = {
  title: "Wishes/DepositCoinScreen",
  component: DepositCoinScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DepositCoinScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    wishId: "w3",
    amount: 5_000,
    expectedVersion: 1,
    source: { kind: "card" },
  },
};
