// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WishShareWriteForm } from "./wish-share-write-form";
import { peekShareTicket } from "./share-ticket";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

it("고른 공개 범위를 표로 남기고 로딩 화면으로 이동한다", async () => {
  const user = userEvent.setup();
  render(
    <WishShareWriteForm
      ticketName="share:wish"
      donePath="/loading"
      initialVisibility="ACADEMY"
      submitLabel="공유하기"
    />,
  );

  const radio = screen.getByRole("radio", { name: "학원 전체" });
  radio.focus();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("radio", { name: "팔로워 공개" })).toHaveAttribute(
    "aria-checked",
    "true",
  );

  await user.click(screen.getByRole("button", { name: "공유하기" }));

  await waitFor(() => expect(replace).toHaveBeenCalledWith("/loading"));
  expect(peekShareTicket("share:wish")).toBe("FOLLOWERS");
});

it("이미 공유한 위시는 지금 범위가 골라진 채로 열리고 비공개를 고를 수 있다", async () => {
  const user = userEvent.setup();
  render(
    <WishShareWriteForm
      ticketName="share:shared"
      donePath="/loading"
      initialVisibility="FOLLOWERS"
      canUnshare
      submitLabel="수정하기"
    />,
  );

  expect(screen.getByRole("radio", { name: "팔로워 공개" })).toHaveAttribute(
    "aria-checked",
    "true",
  );

  await user.click(screen.getByRole("radio", { name: "비공개" }));
  await user.click(screen.getByRole("button", { name: "수정하기" }));

  await waitFor(() => expect(peekShareTicket("share:shared")).toBe("PRIVATE"));
});
