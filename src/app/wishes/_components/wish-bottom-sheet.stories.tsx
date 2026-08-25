import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishBottomSheet } from "./wish-bottom-sheet";

const meta = {
  title: "Wishes/WishBottomSheet",
  component: WishBottomSheet,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WishBottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 열림: Story = {
  args: { isOpen: true, onClose: () => {} },
};

export const 정보수정연결: Story = {
  args: { isOpen: true, onClose: () => {}, infoHref: "/wishes/w3/info" },
};
