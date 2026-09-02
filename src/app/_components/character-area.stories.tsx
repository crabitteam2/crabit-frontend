import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CharacterArea } from "./character-area";
import { HomeHeader } from "./home-header";

const meta = {
  title: "Home/CharacterArea",
  component: CharacterArea,
  parameters: { layout: "fullscreen" },
  args: {
    children: <HomeHeader nickname="아라" wishPurpose="시나모롤 키링" />,
  },
} satisfies Meta<typeof CharacterArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { stage: null },
};

export const Stage10: Story = { args: { stage: 10 } };
export const Stage30: Story = { args: { stage: 30 } };
export const Stage60: Story = { args: { stage: 60 } };
export const Stage100: Story = { args: { stage: 100 } };
