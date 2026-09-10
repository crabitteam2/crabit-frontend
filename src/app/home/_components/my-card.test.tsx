import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MyCard } from "./my-card";

describe("MyCard", () => {
  it("잔액과 위시에 더 넣을 수 있는 금액을 표시한다", () => {
    render(
      <MyCard
        ownerName="권아라"
        balance={100000}
        wishAvailableBalance={70000}
      />,
    );

    expect(screen.getByText(/100,000/)).toBeVisible();
    expect(
      screen.getByText(/위시에 더 넣을 수 있는 금액 : 70,000 원/),
    ).toBeVisible();
  });

  it("잔액을 모르면 금액 대신 안내 문구를 보여준다", () => {
    render(
      <MyCard ownerName="권아라" balance={null} wishAvailableBalance={null} />,
    );

    expect(screen.getByText("잔액을 확인하지 못했어요")).toBeVisible();
    expect(screen.queryByText(/원/)).toBeNull();
  });

  it("카드 소유자 이름과 카드 번호를 표시한다", () => {
    render(<MyCard ownerName="권아라" balance={0} wishAvailableBalance={0} />);

    expect(screen.getByText("권아라의 크래빗 카드")).toBeVisible();
    expect(screen.getByText("0000-0000-0000-0000")).toBeVisible();
  });
});
