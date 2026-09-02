import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AdjustSourceCard } from "./adjust-source-card";

const meta = {
  title: "Adjust/AdjustSourceCard",
  component: AdjustSourceCard,
  parameters: { layout: "padded" },
} satisfies Meta<typeof AdjustSourceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 선택안됨: Story = {
  args: {
    label: "시나모롤 키링",
    amount: 20_000,
    percent: 53,
    isSelected: false,
  },
};

export const 선택됨: Story = {
  args: {
    label: "시나모롤 키링",
    amount: 20_000,
    percent: 53,
    isSelected: true,
  },
};

export const 긴이름: Story = {
  args: {
    label: "산리오 캐릭터즈 대형 인형 세트 한정판",
    amount: 1_200_000,
    percent: 100,
    isSelected: false,
  },
};
