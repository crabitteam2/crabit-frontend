import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TopButton } from "./top-button";

const meta = {
  title: "Wishes/TopButton",
  component: TopButton,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TopButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
