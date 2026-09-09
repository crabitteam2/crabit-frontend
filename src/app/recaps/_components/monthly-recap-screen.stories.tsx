import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MonthlyRecapScreen } from "./monthly-recap-screen";

const months = [
  { label: "4월", href: "/recaps/monthly?month=2026-04" },
  { label: "5월", href: "/recaps/monthly?month=2026-05" },
  { label: "6월", href: "/recaps/monthly?month=2026-06" },
  { label: "7월", href: null },
  { label: "8월", href: "/recaps/monthly?month=2026-08" },
];

const highlights = [
  "이번 달 총 32,000원을 모았어요.",
  "목표했던 위시 2개를 완주했어요!",
  "가장 열심히 모은 주는 8월 3주차였고, 주로 월요일에 저축했어요.",
];

const meta = {
  title: "Recaps/MonthlyRecapScreen",
  component: MonthlyRecapScreen,
  parameters: { layout: "fullscreen" },
  args: {
    backHref: "/",
    year: 2026,
    yearOptions: [
      { year: 2026, href: "/recaps/monthly?month=2026-07" },
      { year: 2025, href: "/recaps/monthly?month=2025-07" },
      { year: 2024, href: "/recaps/monthly?month=2024-07" },
    ],
    months,
    intro: "7월의 아라는",
    typeTitle: "불도저형 토끼",
    typeMessage:
      "월 8회 이상의 높은 빈도로 흔들림 없이 목표를 향해 거침없이 질주했어요!",
    highlights,
  },
} satisfies Meta<typeof MonthlyRecapScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 불도저형: Story = {};

export const 꾸준형: Story = {
  args: {
    typeTitle: "꾸준형 토끼",
    typeMessage:
      "소액이라도 5회 이상 꾸준히 모으며 티끌 모아 태산의 정석을 보여줬어요!",
  },
};

export const 단기집중형: Story = {
  args: {
    typeTitle: "단기 집중형 토끼",
    typeMessage: "월말 막판 스퍼트로 집중 저축하며 강력한 뒷심을 발휘했어요!",
  },
};

export const 탐색형: Story = {
  args: {
    typeTitle: "탐색형 토끼",
    typeMessage:
      "이번 달 위시를 변경하거나 저축액을 옮겨 담으며 나에게 맞는 목표를 활발히 탐색했어요!",
  },
};

export const 긴문장: Story = {
  args: {
    highlights: [
      "지금 페이스를 유지하면 '노트북' 목표를 9월 25일에 달성할 수 있어요!",
      "크래빗 영어학원 친구들 중 저축 습관 유지율 상위 15%예요.",
      "이번 달엔 아직 완주한 위시가 없어요. 다음 달엔 함께 달성해봐요!",
    ],
  },
};
