"use client";
import { useForm, type FieldValues, type UseFormProps } from "react-hook-form";
/** Validate on first blur/submit and then on every change. */
export function useWishForm<T extends FieldValues>(options: UseFormProps<T>) {
  return useForm<T>({ mode: "onTouched", reValidateMode: "onChange", ...options });
}
