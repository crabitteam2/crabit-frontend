import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WishSummaryCard } from "./wish-summary-card";

describe("WishSummaryCard", () => {
  it("renders the fresh detail variant supplied by the owner Wish response", () => {
    const { container } = render(
      <WishSummaryCard
        wish={{
          id: "wish-1",
          purpose: "자전거",
          amount: 10_000,
          targetAmount: 100_000,
          state: "IN_PROGRESS",
          version: 3,
          startDate: "26.08.31",
          targetDate: "26.12.31",
          imageUrl: "https://storage.test/signed/large",
        }}
      />,
    );

    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://storage.test/signed/large",
    );
  });
});
