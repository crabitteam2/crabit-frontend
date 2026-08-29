import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeedHeader } from "./feed-header";

const meta = {
  title: "Feed/FeedHeader",
  component: FeedHeader,
  parameters: { layout: "fullscreen" },
  args: { academyName: "크래빗 영어학원", backHref: "/" },
} satisfies Meta<typeof FeedHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
