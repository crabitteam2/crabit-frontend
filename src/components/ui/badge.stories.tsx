import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: { children: "대표", className: "bg-gray-10 text-white" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 대표: Story = {};

export const 위시리스트탭: Story = {
  args: { className: "bg-pink-2 text-pink-5" },
};
