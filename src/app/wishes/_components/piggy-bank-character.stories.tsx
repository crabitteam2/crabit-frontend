import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PiggyBankCharacter } from "./piggy-bank-character";

const meta = {
  title: "Wishes/PiggyBankCharacter",
  component: PiggyBankCharacter,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-pink-1 relative h-[784px] w-[390px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PiggyBankCharacter>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Normal: Story = { args: { expression: "normal" } };
export const Smile: Story = { args: { expression: "smile" } };
export const Heart: Story = { args: { expression: "heart" } };
