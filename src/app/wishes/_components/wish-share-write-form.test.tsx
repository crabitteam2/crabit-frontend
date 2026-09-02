import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WishShareWriteForm } from "./wish-share-write-form";
const { share, replace } = vi.hoisted(() => ({
  share: vi.fn().mockResolvedValue({ ok: true }),
  replace: vi.fn(),
}));
vi.mock("../wish-actions", () => ({ shareWishAction: share }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

describe("follower visibility sharing", () => {
  it("submits FOLLOWERS from the existing sharing form", async () => {
    const user = userEvent.setup();
    render(
      <WishShareWriteForm
        wishId="wish-1"
        version={3}
        donePath="/wishes/wish-1"
      />,
    );
    await user.click(screen.getByRole("radio", { name: "팔로워 공개" }));
    await user.click(screen.getByRole("button", { name: "공유하기" }));
    await waitFor(() =>
      expect(share).toHaveBeenCalledWith("wish-1", 3, "FOLLOWERS"),
    );
    expect(replace).toHaveBeenCalledWith("/wishes/wish-1");
  });
});
