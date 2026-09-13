import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { WishHeroContent } from "./wish-hero-screen";
import { detailWishTheme } from "./wish-theme";

const character = {
  src: { src: "/character.png", width: 200, height: 231 },
  width: 200,
  height: 231,
};

it("큰 원으로 표시하는 사진은 720을 쓴다", () => {
  const { container } = render(
    <WishHeroContent
      character={character}
      photo={{ small: "/small", medium: "/medium", large: "/large" }}
      headline="목표를 향해 전진중이에요!"
      headlinePaddingTop={0}
      headlinePaddingBottom={0}
      percent={40}
      theme={detailWishTheme}
      purpose="노트북"
      period={null}
      amount={10_000}
      targetAmount={100_000}
    />,
  );

  expect(container.querySelector("img")).toHaveAttribute("src", "/medium");
});
