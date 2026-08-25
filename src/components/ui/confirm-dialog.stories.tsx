import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ConfirmDialog } from "./confirm-dialog";

const meta = {
  title: "UI/ConfirmDialog",
  component: ConfirmDialog,
  parameters: { layout: "fullscreen" },
  args: { isOpen: true, onConfirm: () => {}, onCancel: () => {} },
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
    confirmLabel: "선택하기",
    cancelLabel: "괜찮아요",
  },
};

export const 한줄설명: Story = {
  args: {
    title: "목표를 정말 포기할까요?",
    description: "포기하면 되돌릴 수 없어요.",
    confirmLabel: "포기하기",
    cancelLabel: "괜찮아요",
  },
};
