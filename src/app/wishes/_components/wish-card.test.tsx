import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { WishItem } from "./wish-item";
import { WishCard } from "./wish-card";

const abandonedWish: WishItem = {
  id: "w1",
  purpose: "놀이공원 자유이용권",
  amount: 0,
  abandonmentAmount: 12_000,
  targetAmount: 30_000,
  state: "ABANDONED",
};

describe("종료 위시 목록 카드", () => {
  it("포기 직전 역사 금액으로 진행률을 그린다", () => {
    render(<WishCard wish={abandonedWish} tone="pink" />);

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
  });

  it("포기 직전 0원은 0퍼센트로 그린다", () => {
    render(
      <WishCard
        wish={{ ...abandonedWish, abandonmentAmount: 0 }}
        tone="pink"
      />,
    );

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });
});
