import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Spinner } from "./spinner";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  args: { className: "size-6" },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 글자색: Story = {};

export const 브랜드색: Story = { args: { tone: "brand" } };

export const 멈춤: Story = { args: { tone: "brand", isPaused: true } };
