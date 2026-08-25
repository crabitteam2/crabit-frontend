import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AmountForm } from "./amount-form";

const meta = {
  title: "Wishes/AmountForm",
  component: AmountForm,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AmountForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 저축: Story = {
  args: {
    title: "얼마를 저축할까요?",
    backHref: "/wishes/w3/deposit",
    nextPath: "/wishes/w3/deposit/coin",
    available: 20_000,
    availableLabel: "현재 사용 가능한 금액",
  },
};

export const 출금: Story = {
  args: {
    title: "얼마를 출금할까요?",
    backHref: "/wishes/w3/withdraw",
    nextPath: "/wishes/w3/withdraw/loading",
    available: 4_500,
    availableLabel: "현재 출금 가능한 금액",
  },
};
