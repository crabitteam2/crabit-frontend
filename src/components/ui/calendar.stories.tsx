import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Calendar, type DateRange } from "./calendar";

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

function Playground({ initial }: { initial: DateRange }) {
  const [range, setRange] = useState(initial);
  return <Calendar value={range} onChange={setRange} />;
}

export const 선택없음: Story = {
  args: { value: { start: null, end: null }, onChange: () => {} },
  render: () => <Playground initial={{ start: null, end: null }} />,
};

export const 기간선택: Story = {
  args: {
    value: { start: "2026.08.10", end: "2026.08.21" },
    onChange: () => {},
  },
  render: () => (
    <Playground initial={{ start: "2026.08.10", end: "2026.08.21" }} />
  ),
};

export const 시작일만: Story = {
  args: { value: { start: "2026.08.10", end: null }, onChange: () => {} },
  render: () => <Playground initial={{ start: "2026.08.10", end: null }} />,
};
