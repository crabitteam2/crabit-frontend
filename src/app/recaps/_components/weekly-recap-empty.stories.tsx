import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WeeklyRecapEmpty } from "./weekly-recap-empty";

const meta = {
  title: "Recaps/WeeklyRecapEmpty",
  component: WeeklyRecapEmpty,
  parameters: { layout: "fullscreen" },
  args: { closeHref: "/" },
} satisfies Meta<typeof WeeklyRecapEmpty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};
