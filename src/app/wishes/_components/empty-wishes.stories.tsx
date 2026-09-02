import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyWishes } from "./empty-wishes";

const meta = {
  title: "Wishes/EmptyWishes",
  component: EmptyWishes,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EmptyWishes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
