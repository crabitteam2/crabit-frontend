import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyWishCard } from "./empty-wish-card";

const meta = {
  title: "Wishes/EmptyWishCard",
  component: EmptyWishCard,
  parameters: { layout: "padded" },
} satisfies Meta<typeof EmptyWishCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "진행중인 위시리스트가 없어요." },
};
