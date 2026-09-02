import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HistoryFilterBar } from "./history-filter-bar";

const meta = {
  title: "Wishes/HistoryFilterBar",
  component: HistoryFilterBar,
  parameters: { layout: "fullscreen" },
  args: { period: "3개월", sort: "최신순", onApply: () => {} },
} satisfies Meta<typeof HistoryFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
