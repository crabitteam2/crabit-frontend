import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HistoryList } from "./history-list";

const meta = {
  title: "Wishes/HistoryList",
  component: HistoryList,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HistoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    movements: [
      {
        id: "m1",
        occurredAt: new Date("2026-08-10T14:31:05+09:00"),
        kind: "DEPOSIT",
        amount: 1_500,
        balanceAfter: 4_500,
      },
      {
        id: "m2",
        occurredAt: new Date("2026-08-03T21:05:18+09:00"),
        kind: "WITHDRAWAL",
        amount: 500,
        balanceAfter: 3_000,
      },
      {
        id: "m3",
        occurredAt: new Date("2026-07-28T18:22:31+09:00"),
        kind: "DEPOSIT",
        amount: 1_000,
        balanceAfter: 3_500,
      },
    ],
  },
};

export const 빈목록: Story = { args: { movements: [] } };
