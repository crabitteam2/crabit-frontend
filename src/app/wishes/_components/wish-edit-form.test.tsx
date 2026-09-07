import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // oxlint-disable-next-line next/no-img-element -- Render the image mock without Next static asset handling.
    <img alt={alt} src={src} />
  ),
}));

const push = vi.fn();
const patchWish = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/hooks/use-keyboard-viewport", () => ({
  useKeyboardViewport: () => null,
}));
vi.mock("@/lib/http/browser", () => ({ createBrowserApiClient: () => ({}) }));
vi.mock("@/lib/http/wishes", () => ({
  patchWish: (...args: unknown[]) => patchWish(...args),
}));

import { WishEditForm } from "./wish-edit-form";

describe("WishEditForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads actual initial values, requires erased fields, and recognizes reverted edits", async () => {
    const user = userEvent.setup();
    render(
      <WishEditForm
        backHref="/"
        donePath="/done"
        purpose="선물"
        targetAmount={10000}
        currentAmount={5000}
        cardBalanceAccountId="account"
        wishId="wish"
        version={3}
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
        cardBalanceAccountId="account"
        wishId="wish"
        version={3}
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
  it("patches normalized fields and clears dates explicitly", async () => {
    patchWish.mockResolvedValue({ ok: true, data: {} });
    const user = userEvent.setup();
    render(
      <WishEditForm
        backHref="/"
        donePath="/done"
        purpose="선물"
        targetAmount={10000}
        currentAmount={5000}
        period="26.09.10 - 26.09.20"
        cardBalanceAccountId="account"
        wishId="wish"
        version={3}
      />,
    );
    await user.clear(screen.getByRole("textbox", { name: "위시" }));
    await user.type(
      screen.getByRole("textbox", { name: "위시" }),
      "  새 선물  ",
    );
    await user.clear(screen.getByRole("textbox", { name: "위시 금액" }));
    await user.type(
      screen.getByRole("textbox", { name: "위시 금액" }),
      "20000",
    );
    await user.click(screen.getByRole("textbox", { name: "위시 기간" }));
    await user.click(screen.getByRole("button", { name: "2026년 9월 11일" }));
    await user.click(screen.getByRole("button", { name: "2026년 9월 11일" }));
    await user.click(screen.getByRole("button", { name: "넘어가기" }));
    await user.click(screen.getByRole("button", { name: "다음" }));
    await waitFor(() =>
      expect(patchWish).toHaveBeenCalledWith(expect.anything(), {
        cardBalanceAccountId: "account",
        wishId: "wish",
        body: {
          expectedVersion: 3,
          purpose: "새 선물",
          targetAmount: 20000,
          startDate: null,
          targetDate: null,
        },
      }),
    );
    expect(push).toHaveBeenCalledWith("/done");
  });
  it("patches a changed date in ISO format while omitting unchanged fields", async () => {
    patchWish.mockResolvedValue({ ok: true, data: {} });
    const user = userEvent.setup();
    render(
      <WishEditForm
        backHref="/"
        donePath="/done"
        purpose="선물"
        targetAmount={10000}
        period="26.09.10 - 26.09.20"
        cardBalanceAccountId="account"
        wishId="wish"
        version={3}
      />,
    );
    await user.click(screen.getByRole("textbox", { name: "위시 기간" }));
    await user.click(screen.getByRole("button", { name: "2026년 9월 11일" }));
    await user.click(screen.getByRole("button", { name: "2026년 9월 20일" }));
    await user.click(screen.getByRole("button", { name: "다음" }));
    await user.click(screen.getByRole("button", { name: "다음" }));
    await waitFor(() =>
      expect(patchWish).toHaveBeenCalledWith(expect.anything(), {
        cardBalanceAccountId: "account",
        wishId: "wish",
        body: { expectedVersion: 3, startDate: "2026-09-11" },
      }),
    );
  });
});
