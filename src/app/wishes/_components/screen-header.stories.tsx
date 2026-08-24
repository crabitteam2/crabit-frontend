import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScreenHeader } from "./screen-header";

const meta = {
  title: "Wishes/ScreenHeader",
  component: ScreenHeader,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ScreenHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 목록: Story = {
  args: { title: "진행중인 위시", backHref: "/" },
};

export const 상세: Story = {
  args: { title: "저축 기록 내역", backHref: "/wishes", dense: true },
};
