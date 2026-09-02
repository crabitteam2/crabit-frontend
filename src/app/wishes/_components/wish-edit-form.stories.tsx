import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishEditForm } from "./wish-edit-form";

const meta = {
  title: "Wishes/WishEditForm",
  component: WishEditForm,
  parameters: { layout: "fullscreen" },
  args: {
    backHref: "/wishes/w3/info",
    donePath: "/wishes/w3/info/done",
  },
} satisfies Meta<typeof WishEditForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    purpose: "시나모롤 인형",
    targetAmount: 30_000,
    period: "2026.08.24-2026.10.25",
  },
};

export const 기간없음: Story = {
  args: { purpose: "시나모롤 인형", targetAmount: 30_000, period: null },
};
