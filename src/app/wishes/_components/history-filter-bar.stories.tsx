import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HistoryFilterBar } from "./history-filter-bar";

const meta = {
  title: "Wishes/HistoryFilterBar",
  component: HistoryFilterBar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HistoryFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
