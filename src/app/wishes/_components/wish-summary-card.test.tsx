import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { WishDetail } from "./wish-detail";
import { WishSummaryCard } from "./wish-summary-card";

const abandonedWish: WishDetail = {
  id: "w1",
  purpose: "놀이공원 자유이용권",
  amount: 0,
  abandonmentAmount: 12_000,
  targetAmount: 30_000,
  state: "ABANDONED",
  version: 3,
  startDate: "26.08.01",
  targetDate: "26.10.31",
};

describe("위시 상세 요약 카드", () => {
  it("포기 위시의 역사 금액과 당시 진행률을 표시한다", () => {
    render(<WishSummaryCard wish={abandonedWish} />);

    expect(screen.getByText("12,000")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
  });

  it("진행중 위시는 기존 현재 금액 표시를 유지한다", () => {
    render(
      <WishSummaryCard
        wish={{
          ...abandonedWish,
          amount: 4_500,
          abandonmentAmount: null,
          state: "IN_PROGRESS",
        }}
      />,
    );

    expect(screen.getByText("4,500")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "15",
    );
  });
});
