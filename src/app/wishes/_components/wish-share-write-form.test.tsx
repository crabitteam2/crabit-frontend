import { it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WishShareWriteForm } from "./wish-share-write-form";
const { share, replace } = vi.hoisted(() => ({
  share: vi.fn(),
  replace: vi.fn(),
}));
vi.mock("../wish-actions", () => ({ shareWishAction: share }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
it("supports radio keyboard, blocks duplicate requests, and permits failure retry", async () => {
  let resolve!: (value: unknown) => void;
  share
    .mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    )
    .mockResolvedValueOnce({ ok: true });
  const user = userEvent.setup();
  render(<WishShareWriteForm wishId="wish" version={7} donePath="/done" />);
  const radio = screen.getByRole("radio", { name: "학원 전체" });
  radio.focus();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("radio", { name: "친한 친구 공개" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  const button = screen.getByRole("button", { name: "공유하기" });
  await user.click(button);
  fireEvent.submit(button.closest("form")!);
  expect(share).toHaveBeenCalledTimes(1);
  expect(share).toHaveBeenCalledWith("wish", 7, "FRIENDS");
  resolve({ ok: false, message: "다시 시도해주세요" });
  await waitFor(() => expect(button).toBeEnabled());
  await user.click(button);
  await waitFor(() => expect(replace).toHaveBeenCalledWith("/done"));
  expect(share).toHaveBeenCalledTimes(2);
});
