import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WishPhotoForm } from "./wish-photo-form";

const meta = {
  title: "Wishes/WishPhotoForm",
  component: WishPhotoForm,
  parameters: { layout: "fullscreen" },
  args: {
    backHref: "/wishes/new/period",
    nextPath: "/wishes/new/done",
    query: "purpose=시나모롤 키링&targetAmount=50000",
  },
} satisfies Meta<typeof WishPhotoForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};
