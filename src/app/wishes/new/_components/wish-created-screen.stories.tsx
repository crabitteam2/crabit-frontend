import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishCreatedScreen } from "./wish-created-screen";

const meta = {
  title: "Wishes/WishCreatedScreen",
  component: WishCreatedScreen,
  parameters: { layout: "fullscreen" },
  args: {
    purpose: "위시 텍스트 입력칸(목표 이름)",
    targetAmount: 100_000,
    period: "26.08.24 ~ 26.08.25",
    depositHref: "/wishes/w1/deposit",
    closeHref: "/",
  },
} satisfies Meta<typeof WishCreatedScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 사진없음: Story = {};

export const 기간없음: Story = { args: { period: null } };
