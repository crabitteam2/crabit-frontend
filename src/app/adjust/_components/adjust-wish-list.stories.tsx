import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AdjustWishList } from "./adjust-wish-list";

const card = {
  label: "아라의 크래빗 카드",
  balance: 20_000,
  shortage: 5_000,
  cardNumber: "0000-0000-0000-0000",
};

const meta = {
  title: "Adjust/AdjustWishList",
  component: AdjustWishList,
  parameters: { layout: "fullscreen" },
  args: { card },
} satisfies Meta<typeof AdjustWishList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    wishes: [
      { id: "w3", label: "시나모롤 인형", amount: 4_500, percent: 15 },
      { id: "w1", label: "산리오 스티커 세트", amount: 12_000, percent: 40 },
    ],
  },
};

export const 하나만: Story = {
  args: {
    wishes: [{ id: "w3", label: "시나모롤 인형", amount: 4_500, percent: 15 }],
  },
};

export const 없음: Story = { args: { wishes: [] } };
