import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RecapSection } from "./recap-section";

const meta = {
  title: "Home/RecapSection",
  component: RecapSection,
  parameters: { layout: "padded" },
} satisfies Meta<typeof RecapSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
