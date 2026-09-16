import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { DepositDoneScreen } from "./deposit-done-screen";

vi.mock("next/image", () => ({ default: () => <span /> }));

it("shows the event amount and home link with the heart character in the coin screen frame", () => {
  const view = render(<DepositDoneScreen amount={1234} />);
  expect(screen.getByRole("heading")).toHaveTextContent(
    "1,234원을저금통에 넣었어요!",
  );
  expect(screen.getByRole("link", { name: "홈으로" })).toHaveAttribute(
    "href",
    "/",
  );
  const character = view.container.querySelector(
    '[data-piggy-bank="character"]',
  );
  expect(character).toHaveAttribute("data-expression", "heart");
  expect(character).toHaveStyle({
    left: "92px",
    top: "310px",
    width: "207px",
    height: "277px",
  });
});
