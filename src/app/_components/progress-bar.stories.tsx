import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressBar } from "./progress-bar";

const meta = {
  title: "Home/ProgressBar",
  component: ProgressBar,
  parameters: { layout: "padded" },
  args: { targetAmount: 20000 },
  argTypes: {
    percent: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { percent: 0 } };
export const Stage10: Story = { args: { percent: 10 } };
export const Stage30: Story = { args: { percent: 30 } };
export const Stage60: Story = { args: { percent: 60 } };
export const Complete: Story = { args: { percent: 100 } };
