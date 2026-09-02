import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishEditDoneScreen } from "./wish-edit-done-screen";

const meta = {
  title: "Wishes/WishEditDoneScreen",
  component: WishEditDoneScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WishEditDoneScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    purpose: "시나모롤 인형",
    targetAmount: 100_000,
    period: "2026.08.01-2026.08.07",
  },
};

export const 기간없음: Story = {
  args: { purpose: "시나모롤 인형", targetAmount: 100_000, period: null },
};
