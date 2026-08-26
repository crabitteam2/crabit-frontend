import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishGoalForm } from "./wish-goal-form";

const meta = {
  title: "Wishes/WishGoalForm",
  component: WishGoalForm,
  parameters: { layout: "fullscreen" },
  args: {
    backHref: "/wishes",
    nextPath: "/wishes/new/period",
    available: 20_000,
  },
} satisfies Meta<typeof WishGoalForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};
