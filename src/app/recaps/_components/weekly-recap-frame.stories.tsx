import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WeeklyRecapFrame } from "./weekly-recap-frame";

const meta = {
  title: "Recaps/WeeklyRecapFrame",
  component: WeeklyRecapFrame,
  parameters: { layout: "fullscreen" },
  args: {
    step: 1,
    stepCount: 3,
    closeHref: "/",
    children: (
      <p className="text-fg-neutral px-4 text-[20px] leading-7">본문 자리</p>
    ),
  },
} satisfies Meta<typeof WeeklyRecapFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 첫째_장: Story = {};

export const 둘째_장: Story = { args: { step: 2 } };

export const 마지막_장: Story = { args: { step: 3 } };

export const 한_장뿐: Story = { args: { step: 1, stepCount: 1 } };
