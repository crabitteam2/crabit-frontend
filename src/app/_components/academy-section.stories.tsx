import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AcademySection } from "./academy-section";

const meta = {
  title: "Home/AcademySection",
  component: AcademySection,
  parameters: { layout: "padded" },
  args: {
    academyName: "크래빗 영어학원",
  },
} satisfies Meta<typeof AcademySection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
