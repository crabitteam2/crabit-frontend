import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DepositAmountForm } from "./deposit-amount-form";

const meta = {
  title: "Wishes/DepositAmountForm",
  component: DepositAmountForm,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DepositAmountForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { wishId: "w3", available: 20_000 } };
