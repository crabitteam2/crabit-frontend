import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { WishPhotoForm } from "./wish-photo-form";

const { createWish, push } = vi.hoisted(() => ({
  createWish: vi.fn(),
  push: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span aria-label={alt} />,
}));
vi.mock("@/lib/http/browser", () => ({ createBrowserApiClient: () => ({}) }));
vi.mock("@/lib/http/wishes", () => ({ createWish }));
vi.mock("./photo-storage", () => ({
  readWishPhotoUploadState: () => ({ pendingPhoto: null }),
  clearWishPhotoUploadState: vi.fn(),
  stableWishPhotoKey: () => "key",
}));
beforeEach(() => {
  vi.clearAllMocks();
  createWish.mockResolvedValue({
    ok: true,
    data: { wish: { id: "created-wish" } },
  });
});

it.each([
  ["", null, null],
  ["&startDate=2026-09-10&targetDate=2026-09-20", "2026-09-10", "2026-09-20"],
  ["&startDate=&targetDate=2026-09-20", null, "2026-09-20"],
])(
  "creates with validated values and nullable ISO dates: %s",
  async (dates, startDate, targetDate) => {
    render(
      <WishPhotoForm
        backHref="/period"
        nextPath="/done"
        cardBalanceAccountId="account"
        query={`purpose=선물&targetAmount=10000${dates}`}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "넘어가기" }));
    await waitFor(() =>
      expect(createWish).toHaveBeenCalledWith(expect.anything(), {
        cardBalanceAccountId: "account",
        idempotencyKey: "key",
        body: {
          purpose: "선물",
          targetAmount: 10000,
          startDate,
          targetDate,
          photoId: null,
        },
      }),
    );
    expect(push).toHaveBeenCalledWith("/done?wishId=created-wish");
  },
);

it("sends only one create request while repeated form submissions are in flight", async () => {
  let finish!: (value: unknown) => void;
  createWish.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const { container } = render(
    <WishPhotoForm
      backHref="/period"
      nextPath="/done"
      cardBalanceAccountId="account"
      query="purpose=선물&targetAmount=10000"
    />,
  );
  fireEvent.submit(container.querySelector("form")!);
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(createWish).toHaveBeenCalledTimes(1));
  finish({ ok: true, data: { wish: { id: "created-wish" } } });
  await waitFor(() =>
    expect(push).toHaveBeenCalledWith("/done?wishId=created-wish"),
  );
});
