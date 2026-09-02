import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AccountSelect } from "./account-select";

const meta = {
  title: "Wishes/AccountSelect",
  component: AccountSelect,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AccountSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    nextPath: "/wishes/w3/deposit/amount",
    accounts: [
      {
        id: "a1",
        name: "크래빗 카드 사용가능 금액",
        balance: 20_000,
        cardNumber: "0000-0000-0000-0000",
      },
    ],
    wishes: [
      {
        id: "w1",
        purpose: "포켓몬 카드 부스터팩",
        amount: 12_000,
        targetAmount: 30_000,
        state: "IN_PROGRESS",
        startDate: "26.06.01",
        targetDate: "26.10.31",
      },
    ],
  },
};

export const 빈목록: Story = {
  args: { nextPath: "/wishes/w3/deposit/amount", accounts: [], wishes: [] },
};
