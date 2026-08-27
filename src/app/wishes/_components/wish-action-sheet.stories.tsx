import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Wish } from "@/lib/mock/wishes";
import { WishActionSheet } from "./wish-action-sheet";

const wish: Wish = {
  id: "w3",
  purpose: "시나모롤 인형",
  amount: 4_500,
  targetAmount: 30_000,
  state: "IN_PROGRESS",
  startDate: "26.08.24",
  targetDate: "26.10.25",
  imageUrl: "/images/wishes/deposit-hero.png",
};

const meta = {
  title: "Wishes/WishActionSheet",
  component: WishActionSheet,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WishActionSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 열림: Story = {
  args: { wish, onClose: () => {} },
};
