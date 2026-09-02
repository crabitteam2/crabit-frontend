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

/** Crabit 버튼의 시각적 형태와 네이티브 버튼 속성입니다. */
export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> {
  /** 채움 정도입니다. 기본값은 `fill`입니다. */
  variant?: ButtonVariant;
  /** 의미 색상입니다. 기본값은 `primary`입니다. */
  color?: ButtonColor;
  /** 높이와 패딩을 결정하는 크기입니다. 기본값은 `medium`입니다. */
  size?: ButtonSize;
  /** 로딩 스피너를 표시하고 버튼을 비활성화할지 여부입니다. */
  isLoading?: boolean;
  /** 버튼 레이블입니다. */
  children?: ReactNode;
}

/**
 * Crabit의 공통 버튼을 렌더링합니다.
 * 로딩 중에는 `aria-busy`와 네이티브 `disabled`를 함께 적용합니다.
 */
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
      className={`relative inline-flex items-center justify-center rounded-xl font-semibold ${isLoading ? "" : "disabled:opacity-40"} ${sizeStyles[size]} ${toneStyles[variant][color]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            aria-hidden="true"
            className={`absolute animate-spin rounded-full border-2 border-current border-t-transparent ${spinnerStyles[size]}`}
          />
          <span className="opacity-0">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
