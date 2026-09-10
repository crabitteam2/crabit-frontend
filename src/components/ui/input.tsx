"use client";

import { useId, type InputHTMLAttributes, type Ref } from "react";

export type InputVariant = "line" | "line-brand" | "filled";

const variantStyles: Record<
  InputVariant,
  {
    label: string;
    value: string;
    box: string;
    border: string;
    invalidBox?: string;
    invalidBorder?: string;
  }
> = {
  line: {
    label: "text-fg-neutral-muted",
    value: "text-fg-neutral",
    box: "h-11 border-b-2",
    border: "border-stroke-neutral-solid",
  },
  "line-brand": {
    label: "text-fg-brand",
    value: "text-fg-neutral",
    box: "h-11 border-b-2",
    border: "border-stroke-brand",
  },
  filled: {
    label: "text-fg-brand",
    value: "text-fg-neutral-subtle",
    box: "bg-layer-fill h-14 rounded-xl border px-4",
    border: "border-stroke-brand",
    invalidBox: "bg-critical-weak h-14 rounded-xl border px-4",
    invalidBorder: "border-stroke-neutral-muted",
  },
};

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  ref?: Ref<HTMLInputElement>;
  label: string;
  error?: string;
  variant?: InputVariant;
}

export function Input({
  label,
  error,
  variant = "line",
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const errorId = `${generatedId}-error`;
  const labelId = `${generatedId}-label`;
  const describedBy =
    [props["aria-describedby"], error ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  const isInvalid = error !== undefined && error !== "";
  const styles = variantStyles[variant];
  const boxStyle = isInvalid ? (styles.invalidBox ?? styles.box) : styles.box;
  const borderStyle = isInvalid
    ? (styles.invalidBorder ?? "border-stroke-critical")
    : styles.border;

  return (
    <label className="flex w-full flex-col gap-2">
      <span
        id={labelId}
        className={`text-e1 font-medium ${isInvalid ? "text-error" : styles.label}`}
      >
        {label}
      </span>
      <input
        aria-invalid={isInvalid || undefined}
        className={`placeholder:text-fg-neutral-subtle read-only:text-fg-neutral-subtle w-full text-[16px] leading-[23px] tracking-[-0.3px] outline-none ${styles.value} ${boxStyle} ${borderStyle} ${className}`}
        {...props}
        aria-describedby={describedBy}
        aria-labelledby={props["aria-labelledby"] ?? labelId}
      />
      {isInvalid ? (
        <span id={errorId} role="alert" className="text-e1 text-error">
          {error}
        </span>
      ) : null}
    </label>
  );
}
