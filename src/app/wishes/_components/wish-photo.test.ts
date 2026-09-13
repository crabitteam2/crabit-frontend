import { describe, expect, it } from "vitest";
import { pickWishPhotoUrl } from "./wish-photo";

const photo = { small: "360", medium: "720", large: "1080" };

describe("pickWishPhotoUrl", () => {
  it("작은 자리에는 360 사진을 고른다", () => {
    expect(pickWishPhotoUrl(photo, 64)).toBe("360");
  });

  it("표시 크기의 세 배가 360을 넘으면 720 사진을 고른다", () => {
    expect(pickWishPhotoUrl(photo, 121)).toBe("720");
    expect(pickWishPhotoUrl(photo, 232)).toBe("720");
  });

  it("720으로도 모자라면 가장 큰 사진을 고른다", () => {
    expect(pickWishPhotoUrl(photo, 400)).toBe("1080");
  });
});
