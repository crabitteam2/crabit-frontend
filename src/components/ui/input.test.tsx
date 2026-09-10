import { it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Input } from "./input";
it("forwards focus ref and preserves description while connecting errors", () => {
  const ref = createRef<HTMLInputElement>();
  render(
    <>
      <p id="hint">설명</p>
      <Input ref={ref} label="금액" error="금액 오류" aria-describedby="hint" />
    </>,
  );
  const input = screen.getByRole("textbox", { name: "금액" });
  ref.current?.focus();
  expect(input).toHaveFocus();
  expect(input).toHaveAccessibleDescription("설명 금액 오류");
  expect(input).toHaveAttribute("aria-invalid", "true");
});
