import type { InputHTMLAttributes } from "react";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  const isInvalid = error !== undefined && error !== "";

  return (
    <label className="flex w-full flex-col gap-2">
      <span
        className={`text-e1 font-medium ${isInvalid ? "text-error" : "text-fg-brand"}`}
      >
        {label}
      </span>
      <input
        aria-invalid={isInvalid || undefined}
        className={`text-fg-neutral placeholder:text-fg-neutral-subtle h-11 w-full border-b-2 text-[16px] leading-[23px] tracking-[-0.3px] outline-none ${
          isInvalid ? "border-stroke-critical" : "border-stroke-brand"
        } ${className}`}
        {...props}
      />
      {isInvalid ? <span className="text-e1 text-error">{error}</span> : null}
    </label>
  );
}
