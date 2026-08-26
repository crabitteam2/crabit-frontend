import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ConfirmDialog } from "./confirm-dialog";

const meta = {
  title: "UI/ConfirmDialog",
  component: ConfirmDialog,
  parameters: { layout: "fullscreen" },
  args: {
    isOpen: true,
    onPrimary: () => {},
    onSecondary: () => {},
    onDismiss: () => {},
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 대표위시: Story = {
  args: {
    title: "대표위시로 선택할까요?",
    description: (
      <>
        대표 위시로 설정해 보세요.
        <br />홈 화면 가장 상단에서 확인할 수 있어요.
      </>
    ),
    primaryLabel: "선택하기",
    secondaryLabel: "괜찮아요",
  },
};

export const 목표포기: Story = {
  args: {
    title: "위시를 정말 포기할까요?",
    description: (
      <>
        포기하면 종료 위시로 이동하고,
        <br />
        지금까지 모은 금액은 카드 잔액으로 돌아가요.
      </>
    ),
    primaryLabel: "계속하기",
    secondaryLabel: "포기하기",
  },
};
