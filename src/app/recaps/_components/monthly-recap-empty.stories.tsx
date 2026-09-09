import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MonthlyRecapEmpty } from "./monthly-recap-empty";

const meta = {
  title: "Recaps/MonthlyRecapEmpty",
  component: MonthlyRecapEmpty,
  parameters: { layout: "fullscreen" },
  args: {
    backHref: "/",
    year: 2026,
    yearOptions: [
      { year: 2026, href: "/recaps/monthly?month=2026-07" },
      { year: 2025, href: "/recaps/monthly?month=2025-07" },
      { year: 2024, href: "/recaps/monthly?month=2024-07" },
    ],
    months: [
      { label: "4월", href: "/recaps/monthly?month=2026-04" },
      { label: "5월", href: "/recaps/monthly?month=2026-05" },
      { label: "6월", href: "/recaps/monthly?month=2026-06" },
      { label: "7월", href: null },
      { label: "8월", href: "/recaps/monthly?month=2026-08" },
    ],
    message: "7월 리캡이 아직 완성되지 않았어요.\n8월 초에 다시 확인하세요.",
  },
} satisfies Meta<typeof MonthlyRecapEmpty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};
