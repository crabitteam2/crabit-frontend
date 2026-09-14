import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { CharacterArea } from "./character-area";

it("대표 위시가 있으면 상세 화면으로 가는 링크가 된다", () => {
  render(
    <CharacterArea stage={30} href="/wishes/w1">
      <p>여름 캠프</p>
    </CharacterArea>,
  );

  expect(screen.getByRole("link", { name: "여름 캠프" })).toHaveAttribute(
    "href",
    "/wishes/w1",
  );
});

it("대표 위시가 없으면 누를 수 없다", () => {
  render(
    <CharacterArea stage={null}>
      <p>대표위시가 비어있어요.</p>
    </CharacterArea>,
  );

  expect(screen.queryByRole("link")).toBeNull();
});
