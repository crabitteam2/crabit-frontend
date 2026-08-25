import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
  args: { label: "금액", placeholder: "입력하세요" },
};

export const 값있음: Story = {
  args: { label: "금액", defaultValue: "5,000" },
};

export const 브랜드밑줄: Story = {
  args: { label: "금액", variant: "line-brand", defaultValue: "5,000" },
};

export const 채움: Story = {
  args: { label: "목표", variant: "filled", placeholder: "시나모롤 키링" },
};

export const 읽기전용: Story = {
  args: { label: "목표 기간", readOnly: true, value: "2026.06.01-2026.10.31" },
};

export const 오류: Story = {
  args: {
    label: "금액",
    defaultValue: "99,999",
    error: "사용 가능한 금액을 넘었어요.",
  },
};
