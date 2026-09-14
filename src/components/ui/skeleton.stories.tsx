import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton, SkeletonRegion } from "./skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  args: { className: "h-[172px] w-[320px]" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 카드: Story = {};

export const 버튼: Story = {
  args: { shape: "control", className: "h-12 w-[320px]" },
};

export const 사진: Story = {
  args: { shape: "circle", className: "size-16" },
};

export const 목록: Story = {
  render: () => (
    <SkeletonRegion
      label="위시 목록을 불러오는 중"
      className="flex w-[320px] flex-col gap-10"
    >
      <Skeleton className="h-[172px]" />
      <Skeleton className="h-[172px]" />
    </SkeletonRegion>
  ),
};
