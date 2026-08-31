import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const patchWish = vi.fn();
const uploadWishPhoto = vi.fn();
const deletePendingWishPhoto = vi.fn();
const savePendingWishPhoto = vi.fn();
const clearWishPhotoUploadState = vi.fn();

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
  readWishPhotoUploadState: () => ({
    pendingPhoto: null,
    uploadKey: null,
    mutationKey: null,
  }),
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
});
