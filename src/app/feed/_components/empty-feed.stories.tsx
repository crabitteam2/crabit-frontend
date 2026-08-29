import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyFeed } from "./empty-feed";

const meta = {
  title: "Feed/EmptyFeed",
  component: EmptyFeed,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EmptyFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
