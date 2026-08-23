"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "fill" | "weak";
type ButtonColor = "primary" | "danger" | "dark";
type ButtonSize = "small" | "medium" | "large" | "xlarge";

const sizeStyles: Record<ButtonSize, string> = {
  small: "h-8 px-3 text-e1",
  medium: "h-10 px-4 text-b4",
  large: "h-12 px-5 text-b4",
  xlarge: "h-14 px-6 text-b3",
};

const spinnerStyles: Record<ButtonSize, string> = {
  small: "size-4",
  medium: "size-[18px]",
  large: "size-5",
  xlarge: "size-[22px]",
};

const toneStyles: Record<ButtonVariant, Record<ButtonColor, string>> = {
  fill: {
    primary: "bg-brand-solid text-fg-contrast",
    danger: "bg-error text-fg-contrast",
    dark: "bg-neutral-inverted text-fg-neutral-inverted",
  },
  weak: {
    primary: "bg-brand-weak text-fg-brand",
    danger: "bg-critical-weak text-error",
    dark: "bg-neutral-weak text-fg-neutral",
  },
};

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  isLoading?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = "fill",
  color = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={`inline-flex items-center justify-center rounded-xl font-semibold disabled:opacity-40 ${sizeStyles[size]} ${toneStyles[variant][color]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            aria-hidden="true"
            className={`animate-spin rounded-full border-2 border-current border-t-transparent ${spinnerStyles[size]}`}
          />
          <span className="sr-only">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
