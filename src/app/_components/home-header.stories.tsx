import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HomeHeader } from "./home-header";

const meta = {
  title: "Home/HomeHeader",
  component: HomeHeader,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-[240px] bg-[#5c2343]">
        <Story />
      </div>
    ),
  ],
  args: {
    nickname: "아라",
    wishPurpose: "시나모롤 키링",
  },
} satisfies Meta<typeof HomeHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithRepresentativeWish: Story = {};

export const WithoutRepresentativeWish: Story = {
  args: { wishPurpose: null },
};
