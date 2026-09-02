import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishDetailActions } from "./wish-detail-actions";
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
  title: "Wishes/WishDetailActions",
  component: WishDetailActions,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WishDetailActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { wish },
};
