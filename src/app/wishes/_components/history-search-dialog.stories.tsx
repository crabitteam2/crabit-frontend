import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HistorySearchDialog } from "./history-search-dialog";

const meta = {
  title: "Wishes/HistorySearchDialog",
  component: HistorySearchDialog,
  parameters: { layout: "fullscreen" },
  args: { isOpen: true, kind: null, onSelect: () => {}, onClose: () => {} },
} satisfies Meta<typeof HistorySearchDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const 고른상태: Story = { args: { kind: "꺼낸 돈" } };
