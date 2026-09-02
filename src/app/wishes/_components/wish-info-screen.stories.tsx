import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishInfoScreen } from "./wish-info-screen";

const meta = {
  title: "Wishes/WishInfoScreen",
  component: WishInfoScreen,
  parameters: { layout: "fullscreen" },
  args: { backHref: "/wishes/w3", editHref: "/wishes/w3/info/edit" },
} satisfies Meta<typeof WishInfoScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    purpose: "시나모롤 인형",
    targetAmount: 30_000,
    period: "2026.08.24-2026.10.25",
  },
};

export const 기간없음: Story = {
  args: { purpose: "시나모롤 인형", targetAmount: 30_000, period: null },
};

export const 긴목표이름: Story = {
  args: {
    purpose: "산리오 캐릭터즈 대형 인형 세트 한정판",
    targetAmount: 1_200_000,
    period: "2026.08.24-2027.03.31",
  },
};
