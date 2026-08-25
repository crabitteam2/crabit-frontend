import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toast } from "./toast";

const meta = {
  title: "UI/Toast",
  component: Toast,
  parameters: { layout: "fullscreen" },
  args: { onClose: () => {} },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 성공: Story = {
  args: { message: "설정이 저장되었습니다." },
};

export const 오류: Story = {
  args: { message: "오류가 발생했어요.", tone: "danger" },
};
