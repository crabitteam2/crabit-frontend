import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoadingScreen } from "./loading-screen";

const meta = {
  title: "Wishes/LoadingScreen",
  component: LoadingScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LoadingScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "출금 처리 중",
    donePath: "/wishes/w3/withdraw/done?amount=2000",
  },
};
