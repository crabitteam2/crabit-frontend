import type { InputHTMLAttributes } from "react";

export type InputVariant = "line" | "line-brand" | "filled";

const variantStyles: Record<
  InputVariant,
  { label: string; box: string; border: string }
> = {
  line: {
    label: "text-fg-neutral-muted",
    box: "h-11 border-b-2",
    border: "border-stroke-neutral-solid",
  },
  "line-brand": {
    label: "text-fg-brand",
    box: "h-11 border-b-2",
    border: "border-stroke-brand",
  },
  filled: {
    label: "text-fg-brand",
    box: "bg-layer-fill h-14 rounded-xl border px-4",
    border: "border-stroke-brand",
  },
};

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
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
  const isInvalid = error !== undefined && error !== "";
  const styles = variantStyles[variant];

  return (
    <label className="flex w-full flex-col gap-2">
      <span
        className={`text-e1 font-medium ${isInvalid ? "text-error" : styles.label}`}
      >
        {label}
      </span>
      <input
        aria-invalid={isInvalid || undefined}
        className={`text-fg-neutral placeholder:text-fg-neutral-subtle read-only:text-fg-neutral-subtle w-full text-[16px] leading-[23px] tracking-[-0.3px] outline-none ${styles.box} ${
          isInvalid ? "border-stroke-critical" : styles.border
        } ${className}`}
        {...props}
      />
      {isInvalid ? <span className="text-e1 text-error">{error}</span> : null}
    </label>
  );
}
