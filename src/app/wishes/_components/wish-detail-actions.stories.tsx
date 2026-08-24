import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishDetailActions } from "./wish-detail-actions";

const meta = {
  title: "Wishes/WishDetailActions",
  component: WishDetailActions,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WishDetailActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { purpose: "시나모롤 인형" } };
