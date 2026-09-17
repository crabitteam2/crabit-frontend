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
    exit: { href: "/wishes/w3", label: "위시로 돌아가기" },
  },
};

export const 돈넣기: Story = {
  args: {
    action: "돈 넣기",
    reason: "목표 금액을 넘게는 넣을 수 없어요.",
    exit: { href: "/wishes/w3", label: "위시로 돌아가기" },
  },
};

export const 잔액조정: Story = {
  args: {
    action: "잔액 조정",
    reason:
      "7,000원만 꺼내기에 성공했어요. 남은 돈도 꺼내려면 다시 시도해주세요.",
    exit: { href: "/adjust", label: "잔액 조정으로 돌아가기" },
  },
};
