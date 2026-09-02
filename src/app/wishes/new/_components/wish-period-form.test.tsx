import { it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WishPeriodForm } from "./wish-period-form";
const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span aria-label={alt} />,
}));
it("uses explicit endpoints, rejects reversal, allows same-day and target-only", async () => {
  const user = userEvent.setup();
  render(
    <WishPeriodForm
      backHref="/"
      nextPath="/photo"
      purpose="선물"
      targetAmount={10}
    />,
  );
  const now = new Date();
  const day = (d: number) =>
    screen.getByRole("button", {
      name: `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${d}일`,
    });
  await user.click(day(20));
  await user.click(day(10));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "시작일은 목표일보다 늦을 수 없어요.",
  );
  await user.click(screen.getByRole("button", { name: "다음" }));
  expect(push).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "시작일 선택" }));
  await user.click(day(10));
  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  await user.click(screen.getByRole("button", { name: "시작일 해제" }));
  await user.click(screen.getByRole("button", { name: "다음" }));
  await waitFor(() => expect(push).toHaveBeenCalled());
  const query = new URL(push.mock.calls[0]![0], "http://test").searchParams;
  expect(query.has("startDate")).toBe(false);
  expect(query.get("targetDate")).toMatch(/^\d{4}-\d{2}-10$/);
});
