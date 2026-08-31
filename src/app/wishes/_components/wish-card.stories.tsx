import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { WishItem } from "./wish-item";
import { WishCard } from "./wish-card";

const wish: WishItem = {
  id: "w1",
  purpose: "포켓몬 카드 부스터팩",
  amount: 12_000,
  targetAmount: 30_000,
  state: "IN_PROGRESS",
};

const meta = {
  title: "Wishes/WishCard",
  component: WishCard,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WishCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 핑크: Story = { args: { wish, tone: "pink", onMore: () => {} } };

export const 노랑: Story = {
  args: {
    wish: {
      ...wish,
      purpose: "산리오 스티커 세트",
      amount: 6_500,
      targetAmount: 10_000,
    },
    tone: "yellow",
    onMore: () => {},
  },
};

export const 파랑: Story = {
  args: {
    wish: {
      ...wish,
      purpose: "시나모롤 인형",
      amount: 4_500,
      targetAmount: 30_000,
    },
    tone: "blue",
    onMore: () => {},
  },
};

export const 목표달성: Story = {
  args: {
    wish: {
      ...wish,
      purpose: "축구공",
      amount: 25_000,
      targetAmount: 25_000,
      state: "AMOUNT_REACHED",
    },
    tone: "pink",
    onMore: () => {},
  },
};

export const 완료: Story = {
  args: {
    wish: {
      ...wish,
      purpose: "공룡 레고 시리즈",
      amount: 45_000,
      targetAmount: 45_000,
      state: "COMPLETED",
    },
    tone: "pink",
  },
};

export const 포기: Story = {
  args: {
    wish: {
      ...wish,
      purpose: "놀이공원 자유이용권",
      amount: 12_000,
      targetAmount: 55_000,
      state: "ABANDONED",
    },
    tone: "pink",
  },
};

export const 긴이름: Story = {
  args: {
    wish: {
      ...wish,
      purpose: "학교 앞 문구점에서 파는 캐릭터 젤리펜 세트 열두 자루",
    },
    tone: "pink",
    onMore: () => {},
  },
};

export const 대표위시: Story = {
  args: {
    wish: {
      id: "w1",
      purpose: "시나모롤 키링",
      amount: 30_000,
      targetAmount: 30_000,
      state: "AMOUNT_REACHED",
    },
    tone: "pink",
    isRepresentative: true,
  },
};

export const 사진있음: Story = {
  args: {
    wish: {
      ...wish,
      imageUrl: "/images/wishes/deposit-hero.png",
    },
    tone: "pink",
  },
};
