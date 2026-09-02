import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WishGoalForm } from "./wish-goal-form";
const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/hooks/use-keyboard-viewport", () => ({
  useKeyboardViewport: () => null,
}));
beforeEach(() => push.mockClear());
const setup = () => {
  render(<WishGoalForm backHref="/" nextPath="/period" available={20} />);
  return userEvent.setup();
};
describe("goal form", () => {
  it("shows errors after blur, clears on correction and focuses first invalid field", async () => {
    const user = setup();
    const purpose = screen.getByRole("textbox", { name: "위시" });
    expect(screen.queryByRole("alert")).toBeNull();
    await user.click(purpose);
    await user.tab();
    expect(await screen.findByRole("alert")).toBeVisible();
    await user.type(purpose, "선물");
    await waitFor(() =>
      expect(purpose).not.toHaveAttribute("aria-invalid", "true"),
    );
    await user.click(screen.getByRole("button", { name: "다음" }));
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: "위시 금액" })).toHaveFocus(),
    );
    expect(push).not.toHaveBeenCalled();
  });
  it("moves focus on Enter, protects IME, preserves invalid paste and allows targets above cash", async () => {
    const user = setup();
    const purpose = screen.getByRole("textbox", { name: "위시" });
    const amount = screen.getByRole("textbox", { name: "위시 금액" });
    await user.type(purpose, "선물");
    fireEvent.keyDown(purpose, { key: "Enter", isComposing: true });
    expect(purpose).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(amount).toHaveFocus();
    expect(amount).toHaveAttribute("inputmode", "numeric");
    expect(amount).toHaveAttribute("type", "text");
    await user.type(amount, "-100");
    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(amount).toHaveValue("-100");
    expect(push).not.toHaveBeenCalled();
    await user.clear(amount);
    await user.type(amount, "30000{Enter}");
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(
        expect.stringContaining("targetAmount=30000"),
      ),
    );
  });
});
