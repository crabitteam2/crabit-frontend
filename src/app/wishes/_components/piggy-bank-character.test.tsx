import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { PiggyBankCharacter } from "./piggy-bank-character";
import { FRONT_CLIP } from "./coin-drop-geometry";

it("keeps the same decorative body and frame when expressions change", () => {
  const view = render(<PiggyBankCharacter expression="normal" />);
  const character = view.container.firstElementChild as HTMLElement;
  const body = character.querySelector("[data-piggy-body]");
  for (const expression of ["normal", "smile", "heart"] as const) {
    view.rerender(<PiggyBankCharacter expression={expression} />);
    expect(view.container.firstElementChild).toBe(character);
    expect(character.querySelector("[data-piggy-body]")).toBe(body);
    expect(character).toHaveStyle({
      left: "92px",
      top: "310px",
      width: "207px",
      height: "277px",
    });
    expect(character).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).toBeNull();
    const face = character.querySelector<HTMLElement>("[data-piggy-face]");
    if (expression === "smile") expect(face).toBeNull();
    else {
      expect(face?.style.maskImage).toContain("radial-gradient");
    }
  }
});

it("clips the identical foreground body at the existing slot edge", () => {
  const view = render(<PiggyBankCharacter expression="smile" foreground />);
  expect(view.container.firstElementChild).toHaveStyle({
    left: "92px",
    top: "310px",
    width: "207px",
    height: "277px",
  });
  expect((view.container.firstElementChild as HTMLElement).style.clipPath).toBe(
    FRONT_CLIP,
  );
  expect(view.container.firstElementChild).toHaveAttribute(
    "data-piggy-bank",
    "foreground",
  );
});
