import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WishCard } from "./wish-card";

const wish = {
  id: "wish-1",
  purpose: "자전거",
  amount: 10_000,
  targetAmount: 100_000,
  state: "IN_PROGRESS" as const,
};

describe("WishCard", () => {
  it("renders an authorized signed variant when the Wish has a photo", () => {
    const { container } = render(
      <WishCard
        wish={{ ...wish, imageUrl: "https://storage.test/signed/medium" }}
        tone="pink"
      />,
    );

    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://storage.test/signed/medium",
    );
  });

  it("does not invent a photo when the contract returns null", () => {
    const { container } = render(<WishCard wish={wish} tone="pink" />);
    expect(container.querySelector("img")).toBeNull();
  });
});
