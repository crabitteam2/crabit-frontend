import { it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AmountForm } from "./amount-form";
const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/hooks/use-keyboard-viewport", () => ({
  useKeyboardViewport: () => null,
}));
it("enforces both deposit bounds and retains the selected source", async () => {
  const user = userEvent.setup();
  render(
    <AmountForm
      title="입금"
      backHref="/"
      nextPath="/coin"
      available={6500}
      remaining={1500}
      from="w2"
      availableLabel="잔액"
    />,
  );
  const amount = screen.getByRole("textbox", { name: "금액" });
  await user.type(amount, "2000");
  await user.click(screen.getByRole("button", { name: "다음" }));
  expect(
    await screen.findByText("목표까지 남은 금액을 넘었어요."),
  ).toBeVisible();
  expect(push).not.toHaveBeenCalled();
  await user.clear(amount);
  await user.type(amount, "1500{Enter}");
  await waitFor(() =>
    expect(push).toHaveBeenCalledWith("/coin?amount=1500&from=w2"),
  );
});
