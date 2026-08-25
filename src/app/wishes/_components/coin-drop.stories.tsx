import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CoinDrop } from "./coin-drop";

const meta = {
  title: "Wishes/CoinDrop",
  component: CoinDrop,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-pink-1 relative h-[784px] w-[390px] overflow-hidden">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CoinDrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onDrop: () => {} } };
