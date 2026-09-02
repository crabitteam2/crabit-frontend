import { it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WishEditForm } from "./wish-edit-form";
vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span aria-label={alt} />,
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/hooks/use-keyboard-viewport", () => ({
  useKeyboardViewport: () => null,
}));
it("loads actual initial values, requires erased fields, and recognizes reverted edits", async () => {
  const user = userEvent.setup();
  render(
    <WishEditForm
      backHref="/"
      donePath="/done"
      purpose="선물"
      targetAmount={10000}
      currentAmount={5000}
      period={null}
    />,
  );
  const purpose = screen.getByRole("textbox", { name: "위시" });
  const amount = screen.getByRole("textbox", { name: "위시 금액" });
  const next = screen.getByRole("button", { name: "다음" });
  expect(purpose).toHaveValue("선물");
  expect(amount).toHaveValue("10,000");
  expect(next).toBeDisabled();
  await user.type(purpose, "들");
  expect(next).toBeEnabled();
  await user.keyboard("{Backspace}");
  expect(next).toBeDisabled();
  await user.clear(purpose);
  expect(next).toBeEnabled();
  await user.click(next);
  expect(purpose).toHaveFocus();
  expect(await screen.findByText("위시를 입력해주세요.")).toBeVisible();
  await user.type(purpose, "선물");
  await user.clear(amount);
  await user.type(amount, "4999");
  await user.tab();
  await waitFor(() =>
    expect(
      screen.getByText("현재 모인 금액보다 작게 설정할 수 없어요."),
    ).toBeVisible(),
  );
});

it("can close the calendar while a required text field is invalid", async () => {
  const user = userEvent.setup();
  render(
    <WishEditForm
      backHref="/"
      donePath="/done"
      purpose="선물"
      targetAmount={10000}
      currentAmount={5000}
      period={null}
    />,
  );
  await user.clear(screen.getByRole("textbox", { name: "위시" }));
  await user.click(screen.getByRole("textbox", { name: "위시 기간" }));
  const close = screen.getByRole("button", { name: "넘어가기" });
  expect(close).toHaveAttribute("type", "button");
  await user.click(close);
  expect(screen.getByRole("textbox", { name: "위시" })).toHaveValue("");
  expect(screen.getByRole("button", { name: "다음" })).toHaveAttribute(
    "type",
    "submit",
  );
});
