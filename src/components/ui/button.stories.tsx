import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "padded",
  },
  args: {
    children: "메인 액션",
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["fill", "weak"] },
    color: {
      control: "inline-radio",
      options: ["primary", "danger", "dark"],
    },
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large", "xlarge"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const VariantColorSizeMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["fill", "weak"] as const).map((variant) =>
        (["primary", "danger", "dark"] as const).map((color) => (
          <section key={`${variant}-${color}`} className="flex flex-col gap-3">
            <p className="text-e1 text-fg-neutral-muted">
              {variant} · {color}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {(["small", "medium", "large", "xlarge"] as const).map((size) => (
                <Button key={size} variant={variant} color={color} size={size}>
                  메인 액션
                </Button>
              ))}
            </div>
          </section>
        )),
      )}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onClick: fn(),
    size: "large",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "메인 액션" });

    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    onClick: fn(),
    size: "large",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "메인 액션" });

    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const FullWidth: Story = {
  args: {
    className: "w-full",
    size: "xlarge",
  },
};
