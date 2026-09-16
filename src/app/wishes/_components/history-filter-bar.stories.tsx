import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HistoryFilterBar } from "./history-filter-bar";

const meta = {
  title: "Wishes/HistoryFilterBar",
  component: HistoryFilterBar,
  parameters: { layout: "fullscreen" },
  args: {
    period: "3개월",
    sort: "최신순",
    kind: null,
    onApply: () => {},
    onKindChange: () => {},
  },
} satisfies Meta<typeof HistoryFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const 종류를고른상태: Story = { args: { kind: "꺼낸 돈" } };
