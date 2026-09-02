import { describe, expect, it } from "vitest";
import { centeredSquareCrop, WISH_PHOTO_SIZE } from "./photo-jpeg";

describe("Wish JPEG preparation", () => {
  it("always targets the contract's exact output dimensions", () => {
    expect(WISH_PHOTO_SIZE).toBe(1080);
  });

  it("centers a square crop in landscape and portrait input", () => {
    expect(centeredSquareCrop(4000, 3000)).toEqual({
      sx: 500,
      sy: 0,
      size: 3000,
    });
    expect(centeredSquareCrop(3000, 4000)).toEqual({
      sx: 0,
      sy: 500,
      size: 3000,
    });
  });
});
