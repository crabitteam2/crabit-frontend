import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Wish } from "@/lib/mock/wishes";
import { WishProgressBar } from "./wish-progress-bar";
import {
  detailWishTheme,
  emptyWishTheme,
  getWishTheme,
  type WishTone,
} from "./wish-theme";

const base: Wish = {
  id: "w1",
  purpose: "포켓몬 카드 부스터팩",
  amount: 12_000,
  targetAmount: 30_000,
  state: "IN_PROGRESS",
  startDate: "26.06.01",
  targetDate: "26.10.31",
};

const inProgress = (tone: WishTone, percent: number) => ({
  percent,
  theme: getWishTheme(base, tone, percent),
});

const meta = {
  title: "Wishes/WishProgressBar",
  component: WishProgressBar,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WishProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 핑크: Story = { args: inProgress("pink", 40) };
export const 노랑: Story = { args: inProgress("yellow", 65) };
export const 파랑: Story = { args: inProgress("blue", 15) };
export const 핑크100: Story = { args: inProgress("pink", 100) };
export const 노랑100: Story = { args: inProgress("yellow", 100) };
export const 파랑100: Story = { args: inProgress("blue", 100) };

export const 완료: Story = {
  args: {
    percent: 100,
    theme: getWishTheme({ ...base, state: "COMPLETED" }, "pink", 100),
  },
};

export const 포기: Story = {
  args: {
    percent: 40,
    theme: getWishTheme({ ...base, state: "ABANDONED" }, "pink", 40),
  },
};

export const 상세: Story = { args: { percent: 15, theme: detailWishTheme } };
export const 빈카드: Story = { args: { percent: 0, theme: emptyWishTheme } };
