import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishEditForm } from "./wish-edit-form";

const meta = {
  title: "Wishes/WishEditForm",
  component: WishEditForm,
  parameters: { layout: "fullscreen" },
  args: {
    backHref: "/wishes/w3/info",
    donePath: "/wishes/w3/info/done",
    cardBalanceAccountId: "11111111-1111-4111-8111-111111111111",
    wishId: "22222222-2222-4222-8222-222222222222",
    version: 3,
    photo: null,
  },
} satisfies Meta<typeof WishEditForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    purpose: "시나모롤 인형",
    targetAmount: 30_000,
    period: "2026.08.24-2026.10.25",
  },
};

export const 기간없음: Story = {
  args: { purpose: "시나모롤 인형", targetAmount: 30_000, period: null },
};

export const 사진있음: Story = {
  args: {
    purpose: "시나모롤 인형",
    targetAmount: 30_000,
    period: null,
    photo: {
      id: "9a8b7c6d-5e4f-4321-9876-1234567890ab",
      variants: {
        small: "https://storage.example.invalid/signed/small",
        medium: "/images/wishes/deposit-hero.png",
        large: "https://storage.example.invalid/signed/large",
      },
      expiresAt: "2026-08-31T12:05:00Z",
    },
  },
};
