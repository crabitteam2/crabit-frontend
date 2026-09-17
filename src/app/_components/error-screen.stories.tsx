import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ErrorScreen } from "./error-screen";

const meta = {
  title: "App/ErrorScreen",
  component: ErrorScreen,
  parameters: { layout: "fullscreen" },
  args: {
    title: "진행중인 위시",
    backHref: "/",
    message: "위시를 불러오지 못했어요",
    reset: () => {},
  },
} satisfies Meta<typeof ErrorScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const 제목없음: Story = {
  args: { title: undefined, message: "화면을 불러오지 못했어요" },
};

export const 홈으로: Story = {
  args: {
    title: undefined,
    message: "기록을 불러오지 못했어요",
    reset: undefined,
  },
};

export const 탭바있음: Story = { args: { hasTabBar: true } };
