import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { TabBar } from "./tab-bar";

const meta = {
  title: "Home/TabBar",
  component: TabBar,
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="min-h-[1200px] bg-gradient-to-b from-white to-[#fef6fa]">
      <p className="p-4 text-sm">스크롤해 탭 바의 접힘 동작을 확인하세요.</p>
      <TabBar />
    </div>
  ),
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DirectionalScroll: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole("navigation", { name: "주요 화면" });
    const sideIcons = navigation.querySelectorAll<HTMLElement>(
      ":scope > span[aria-hidden='true']",
    );

    await expect(sideIcons).toHaveLength(2);

    window.scrollTo(0, 0);
    window.scrollTo(0, 200);
    await waitFor(() => {
      expect(window.getComputedStyle(sideIcons[0]).width).toBe("0px");
      expect(window.getComputedStyle(sideIcons[1]).width).toBe("0px");
    });

    window.scrollTo(0, 80);
    await waitFor(() => {
      expect(window.getComputedStyle(sideIcons[0]).width).toBe("34px");
      expect(window.getComputedStyle(sideIcons[1]).width).toBe("29px");
    });
  },
};
