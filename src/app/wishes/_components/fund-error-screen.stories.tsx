import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FundErrorScreen } from "./fund-error-screen";

const meta = {
  title: "Wishes/FundErrorScreen",
  component: FundErrorScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FundErrorScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 돈꺼내기: Story = {
  args: {
    action: "돈 꺼내기",
    reason: "연결이 불안정해요. 잠시 후 다시 시도해주세요.",
    wishHref: "/wishes/w3",
  },
};

export const 돈넣기: Story = {
  args: {
    action: "돈 넣기",
    reason: "목표 금액을 넘게는 넣을 수 없어요.",
    wishHref: "/wishes/w3",
  },
};

export const 잔액조정: Story = {
  args: {
    action: "돈 꺼내기",
    reason: "위시 정보가 바뀌었어요. 새로고침한 뒤 다시 시도해주세요.",
  },
};
