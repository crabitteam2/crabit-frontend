import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShortageNotice } from "./shortage-notice";

const meta = {
  title: "Home/ShortageNotice",
  component: ShortageNotice,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ShortageNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
