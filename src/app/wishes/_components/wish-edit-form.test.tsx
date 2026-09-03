import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // oxlint-disable-next-line next/no-img-element -- Render the image mock without Next static asset handling.
    <img alt={alt} src={src} />
  ),
}));

const push = vi.fn();
const patchWish = vi.fn();
const uploadWishPhoto = vi.fn();
const deletePendingWishPhoto = vi.fn();
const savePendingWishPhoto = vi.fn();
const clearWishPhotoUploadState = vi.fn();
const readWishPhotoUploadState = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/hooks/use-keyboard-viewport", () => ({
  useKeyboardViewport: () => null,
}));
vi.mock("@/lib/http/browser", () => ({ createBrowserApiClient: () => ({}) }));
vi.mock("@/lib/http/wishes", () => ({
  patchWish: (...args: unknown[]) => patchWish(...args),
}));
vi.mock("@/lib/http/wish-photos", () => ({
  uploadWishPhoto: (...args: unknown[]) => uploadWishPhoto(...args),
  deletePendingWishPhoto: (...args: unknown[]) =>
    deletePendingWishPhoto(...args),
}));
vi.mock("@/app/wishes/new/_components/photo-jpeg", () => ({
  centeredSquareCrop: () => ({ sx: 0, sy: 0, size: 10 }),
  digestWishPhotoFile: async () => "jpeg-digest",
  renderWishPhotoJpeg: async () =>
    new File(["jpeg"], "wish-photo.jpg", { type: "image/jpeg" }),
}));
vi.mock("@/app/wishes/new/_components/photo-storage", () => ({
  clearPendingWishPhoto: vi.fn(),
  clearWishPhotoUploadState: (...args: unknown[]) =>
    clearWishPhotoUploadState(...args),
  readWishPhotoUploadState: (...args: unknown[]) =>
    readWishPhotoUploadState(...args),
  savePendingWishPhoto: (...args: unknown[]) => savePendingWishPhoto(...args),
  stableWishPhotoKey: () => "stable-upload-key",
}));

import { WishEditForm } from "./wish-edit-form";

const currentPhoto = {
  id: "11111111-1111-4111-8111-111111111111",
  variants: {
    small: "https://storage.test/current-small",
    medium: "https://storage.test/current-medium",
    large: "https://storage.test/current-large",
  },
  expiresAt: "2026-08-31T12:05:00Z",
};
const candidatePhoto = {
  id: "22222222-2222-4222-8222-222222222222",
  variants: {
    small: "https://storage.test/candidate-small",
    medium: "https://storage.test/candidate-medium",
    large: "https://storage.test/candidate-large",
  },
  expiresAt: "2026-08-31T12:06:00Z",
};

describe("WishEditForm photo replacement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    readWishPhotoUploadState.mockReturnValue({
      pendingPhoto: null,
      uploadKey: null,
      mutationKey: null,
    });
    vi.stubGlobal("createImageBitmap", async () => ({
      width: 1080,
      height: 1080,
      close: vi.fn(),
    }));
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:replacement"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("keeps the current attachment untouched when replacement patch fails", async () => {
    uploadWishPhoto.mockResolvedValue({ ok: true, data: candidatePhoto });
    patchWish.mockResolvedValue({
      ok: false,
      error: {
        kind: "backend",
        status: 409,
        code: "VERSION_CONFLICT",
        message: "conflict",
      },
    });
    const { container } = render(
      <WishEditForm
        backHref="/wishes/wish-1/info"
        donePath="/wishes/wish-1/info/done"
        purpose="자전거"
        targetAmount={100_000}
        period={null}
        cardBalanceAccountId="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"
        wishId="bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb"
        version={3}
        photo={currentPhoto}
      />,
    );
    const input = container.querySelector('input[type="file"]');
    expect(input).not.toBeNull();
    fireEvent.change(input as HTMLInputElement, {
      target: {
        files: [new File(["source"], "source.png", { type: "image/png" })],
      },
    });
    const submit = screen.getByRole("button", { name: "다음" });
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.click(submit);

    await waitFor(() =>
      expect(patchWish).toHaveBeenCalledWith(expect.anything(), {
        cardBalanceAccountId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        wishId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        body: {
          expectedVersion: 3,
          photoId: candidatePhoto.id,
        },
      }),
    );
    expect(deletePendingWishPhoto).not.toHaveBeenCalled();
    expect(clearWishPhotoUploadState).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(savePendingWishPhoto).toHaveBeenCalledWith(
      "edit:bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      candidatePhoto,
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "다른 곳에서 위시가 변경됐어요",
    );
  });

  it("shows and submits the restored Pending candidate after a failed replacement remount", async () => {
    uploadWishPhoto.mockResolvedValue({ ok: true, data: candidatePhoto });
    patchWish.mockResolvedValueOnce({
      ok: false,
      error: {
        kind: "backend",
        status: 409,
        code: "VERSION_CONFLICT",
        message: "conflict",
      },
    });
    const props = {
      backHref: "/wishes/wish-1/info",
      donePath: "/wishes/wish-1/info/done",
      purpose: "자전거",
      targetAmount: 100_000,
      period: null,
      cardBalanceAccountId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      wishId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      version: 3,
      photo: currentPhoto,
    };
    const firstMount = render(<WishEditForm {...props} />);
    fireEvent.change(
      firstMount.container.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement,
      {
        target: {
          files: [new File(["source"], "source.png", { type: "image/png" })],
        },
      },
    );
    fireEvent.click(await screen.findByRole("button", { name: "다음" }));
    await screen.findByRole("alert");
    firstMount.unmount();

    readWishPhotoUploadState.mockReturnValue({
      pendingPhoto: candidatePhoto,
      uploadKey: null,
      mutationKey: null,
    });
    patchWish.mockClear();
    patchWish.mockResolvedValue({ ok: true, data: {} });
    render(<WishEditForm {...props} />);

    const displayedPhoto = await screen.findByRole("img", {
      name: "위시 사진",
    });
    expect(displayedPhoto).toHaveAttribute(
      "src",
      candidatePhoto.variants.medium,
    );
    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    await waitFor(() =>
      expect(patchWish).toHaveBeenCalledWith(expect.anything(), {
        cardBalanceAccountId: props.cardBalanceAccountId,
        wishId: props.wishId,
        body: {
          expectedVersion: props.version,
          photoId: candidatePhoto.id,
        },
      }),
    );
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
        photo={null}
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
        photo={null}
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
  it("patches normalized fields and clears dates explicitly without changing the photo", async () => {
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
        photo={currentPhoto}
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
    await user.click(screen.getByRole("button", { name: "기간 해제" }));
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
    expect(uploadWishPhoto).not.toHaveBeenCalled();
    expect(deletePendingWishPhoto).not.toHaveBeenCalled();
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
        photo={null}
      />,
    );
    await user.click(screen.getByRole("textbox", { name: "위시 기간" }));
    await user.click(screen.getByRole("button", { name: "2026년 9월 11일" }));
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
