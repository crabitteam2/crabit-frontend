import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { QuickActions } from "./quick-actions";

const meta = {
  title: "Home/QuickActions",
  component: QuickActions,
  parameters: { layout: "padded" },
  args: { isLocked: false },
} satisfies Meta<typeof QuickActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unlocked: Story = {};

export const Locked: Story = {
  args: { isLocked: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");

    await expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      await expect(button).toBeDisabled();
    }
    await expect(canvas.getAllByAltText("잠김")).toHaveLength(2);
  },
};
