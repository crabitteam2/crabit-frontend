import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HistoryFilterSheet } from "./history-filter-sheet";

const meta = {
  title: "Wishes/HistoryFilterSheet",
  component: HistoryFilterSheet,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HistoryFilterSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 열림: Story = {
  args: {
    isOpen: true,
    period: "3개월",
    sort: "과거순",
    onClose: () => {},
    onPeriodChange: () => {},
    onSortChange: () => {},
    onReset: () => {},
    onApply: () => {},
  },
};
