import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WishPeriodForm } from "./wish-period-form";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span aria-label={alt} />,
}));

const now = new Date();

const day = (date: number) =>
  screen.getByRole("button", {
    name: `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${date}일`,
  });

const renderForm = () =>
  render(
    <WishPeriodForm
      cardBalanceAccountId="account"
      backHref="/"
      nextPath="/photo"
      purpose="선물"
      targetAmount={10}
    />,
  );

const submittedQuery = () =>
  new URL(push.mock.calls[0]![0], "http://test").searchParams;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("WishPeriodForm", () => {
  it("첫 날짜만 누르면 기간을 확정하지 않고 넘어가기를 유지한다", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(day(10));

    expect(screen.getByRole("button", { name: "넘어가기" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "넘어가기" }));
    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(submittedQuery().has("startDate")).toBe(false);
    expect(submittedQuery().has("targetDate")).toBe(false);
  });

  it("두 번째 날짜에서 기간을 확정한다", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(day(10));
    await user.click(day(20));

    await user.click(screen.getByRole("button", { name: "다음" }));
    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(submittedQuery().get("startDate")).toMatch(/^\d{4}-\d{2}-10$/);
    expect(submittedQuery().get("targetDate")).toMatch(/^\d{4}-\d{2}-20$/);
  });

  it("나중 날짜를 먼저 눌러도 시작과 끝을 맞바꾼다", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(day(20));
    await user.click(day(10));

    expect(screen.queryByRole("alert")).toBeNull();
    await user.click(screen.getByRole("button", { name: "다음" }));
    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(submittedQuery().get("startDate")).toMatch(/^\d{4}-\d{2}-10$/);
    expect(submittedQuery().get("targetDate")).toMatch(/^\d{4}-\d{2}-20$/);
  });

  it("같은 날짜를 두 번 누르면 하루짜리를 만들지 않고 취소한다", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(day(10));
    await user.click(day(10));

    expect(screen.getByRole("button", { name: "넘어가기" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "넘어가기" }));
    await waitFor(() => expect(push).toHaveBeenCalled());
    expect(submittedQuery().has("startDate")).toBe(false);
    expect(submittedQuery().has("targetDate")).toBe(false);
  });
});
