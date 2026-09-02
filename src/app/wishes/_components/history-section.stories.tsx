import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HistorySection } from "./history-section";

const meta = {
  title: "Wishes/HistorySection",
  component: HistorySection,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HistorySection>;

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date();

function monthsAgo(months: number, day: number) {
  const date = new Date(today);
  date.setMonth(date.getMonth() - months);
  date.setDate(day);
  date.setHours(14, 31, 5, 0);
  return date;
}

export const 여러달_기록: Story = {
  args: {
    movements: [
      {
        id: "m1",
        occurredAt: monthsAgo(0, 10),
        kind: "DEPOSIT",
        amount: 1_500,
        balanceAfter: 12_000,
      },
      {
        id: "m2",
        occurredAt: monthsAgo(2, 20),
        kind: "WITHDRAWAL",
        amount: 500,
        balanceAfter: 10_500,
      },
      {
        id: "m3",
        occurredAt: monthsAgo(5, 5),
        kind: "DEPOSIT",
        amount: 3_000,
        balanceAfter: 11_000,
      },
      {
        id: "m4",
        occurredAt: monthsAgo(11, 2),
        kind: "DEPOSIT",
        amount: 8_000,
        balanceAfter: 8_000,
      },
    ],
  },
};

export const 기록_없음: Story = {
  args: { movements: [] },
};
