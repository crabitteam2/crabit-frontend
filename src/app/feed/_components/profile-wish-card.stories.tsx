import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProfileWishCard } from "./profile-wish-card";

const wish = {
  id: "w1",
  purpose: "오시리스 D3 2001",
  percent: 13,
  state: "IN_PROGRESS" as const,
  startDate: "2026.08.24",
  targetDate: "2026.08.25",
};

const meta = {
  title: "Feed/ProfileWishCard",
  component: ProfileWishCard,
  parameters: { layout: "padded" },
  args: { wish, tone: "pink" },
} satisfies Meta<typeof ProfileWishCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 진행중: Story = {};

export const 완료: Story = {
  args: {
    wish: { ...wish, percent: 100, state: "COMPLETED" },
  },
};

export const 포기: Story = {
  args: {
    wish: { ...wish, percent: 64, state: "ABANDONED" },
  },
};
