import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishActionSheet } from "./wish-action-sheet";
import type { OwnedWishItem } from "./wish-item";

const wish: OwnedWishItem = {
  id: "w3",
  purpose: "시나모롤 인형",
  amount: 4_500,
  abandonmentAmount: null,
  targetAmount: 30_000,
  state: "IN_PROGRESS",
  version: 3,
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
