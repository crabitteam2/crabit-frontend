import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishPeriodForm } from "./wish-period-form";

const meta = {
  title: "Wishes/WishPeriodForm",
  component: WishPeriodForm,
  parameters: { layout: "fullscreen" },
  args: {
    backHref: "/wishes/new",
    nextPath: "/wishes/new/photo",
    purpose: "시나모롤 키링",
    targetAmount: 50_000,
  },
} satisfies Meta<typeof WishPeriodForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};
