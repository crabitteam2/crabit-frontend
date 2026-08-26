import { describe, expect, it } from "vitest";
import {
  clampOffset,
  clampScale,
  clampTransform,
  coverScale,
  displayedSize,
  initialTransform,
  MAX_SCALE,
  MIN_SCALE,
  panBy,
  toCropRect,
  zoomAt,
} from "./photo-crop";

const BOX = 358;
const LANDSCAPE = { width: 4000, height: 3000 };
const PORTRAIT = { width: 3000, height: 4000 };
const SQUARE = { width: 2000, height: 2000 };

describe("coverScale", () => {
  it("짧은 변이 틀을 채우는 배율을 고른다", () => {
    expect(coverScale(BOX, LANDSCAPE)).toBeCloseTo(BOX / 3000);
    expect(coverScale(BOX, PORTRAIT)).toBeCloseTo(BOX / 3000);
    expect(coverScale(BOX, SQUARE)).toBeCloseTo(BOX / 2000);
  });

  it("크기를 모르면 1을 돌려준다", () => {
    expect(coverScale(BOX, { width: 0, height: 0 })).toBe(1);
  });
});

describe("clampScale", () => {
  it("허용 범위 밖을 자른다", () => {
    expect(clampScale(0.2)).toBe(MIN_SCALE);
    expect(clampScale(99)).toBe(MAX_SCALE);
    expect(clampScale(2)).toBe(2);
  });

  it("숫자가 아니면 최소 배율로 되돌린다", () => {
    expect(clampScale(Number.NaN)).toBe(MIN_SCALE);
  });
});

describe("clampOffset", () => {
  it("사진이 틀보다 크면 여백이 생기지 않게 막는다", () => {
    expect(clampOffset(50, 500, BOX)).toBe(0);
    expect(clampOffset(-999, 500, BOX)).toBe(BOX - 500);
    expect(clampOffset(-70, 500, BOX)).toBe(-70);
  });

  it("사진이 틀보다 작으면 가운데로 둔다", () => {
    expect(clampOffset(999, 300, BOX)).toBe((BOX - 300) / 2);
  });
});

describe("initialTransform", () => {
  it("가로 사진을 좌우 가운데에 맞춘다", () => {
    const t = initialTransform(BOX, LANDSCAPE);
    const size = displayedSize(t, BOX, LANDSCAPE);
    expect(t.scale).toBe(1);
    expect(t.y).toBeCloseTo(0);
    expect(t.x).toBeCloseTo((BOX - size.width) / 2);
  });

  it("세로 사진을 위아래 가운데에 맞춘다", () => {
    const t = initialTransform(BOX, PORTRAIT);
    const size = displayedSize(t, BOX, PORTRAIT);
    expect(t.x).toBeCloseTo(0);
    expect(t.y).toBeCloseTo((BOX - size.height) / 2);
  });

  it("정사각 사진은 딱 맞는다", () => {
    expect(initialTransform(BOX, SQUARE)).toEqual({ scale: 1, x: 0, y: 0 });
  });
});

describe("panBy", () => {
  it("배율 1인 정사각 사진은 움직이지 않는다", () => {
    const t = panBy(initialTransform(BOX, SQUARE), 80, 80, BOX, SQUARE);
    expect(t).toEqual({ scale: 1, x: 0, y: 0 });
  });

  it("가로 사진은 좌우로만 움직인다", () => {
    const start = initialTransform(BOX, LANDSCAPE);
    const t = panBy(start, -40, -40, BOX, LANDSCAPE);
    expect(t.x).toBeCloseTo(start.x - 40);
    expect(t.y).toBeCloseTo(0);
  });

  it("아무리 끌어도 틀 밖으로 여백이 생기지 않는다", () => {
    const start = initialTransform(BOX, LANDSCAPE);
    for (const delta of [-5000, 5000]) {
      const t = panBy(start, delta, delta, BOX, LANDSCAPE);
      const size = displayedSize(t, BOX, LANDSCAPE);
      expect(t.x).toBeLessThanOrEqual(0);
      expect(t.y).toBeLessThanOrEqual(0);
      expect(t.x + size.width).toBeGreaterThanOrEqual(BOX);
      expect(t.y + size.height).toBeGreaterThanOrEqual(BOX);
    }
  });
});

describe("zoomAt", () => {
  it("중심점 아래 지점이 확대 후에도 같은 자리에 남는다", () => {
    const start = initialTransform(BOX, SQUARE);
    const focus = { x: 100, y: 260 };
    const next = zoomAt(start, 2, focus.x, focus.y, BOX, SQUARE);
    const before = (focus.x - start.x) / start.scale;
    const after = (focus.x - next.x) / next.scale;
    expect(after).toBeCloseTo(before, 5);
  });

  it("최대 배율을 넘지 않는다", () => {
    const t = zoomAt(initialTransform(BOX, SQUARE), 50, 179, 179, BOX, SQUARE);
    expect(t.scale).toBe(MAX_SCALE);
  });

  it("축소해도 최소 배율 아래로 내려가지 않고 여백이 생기지 않는다", () => {
    const zoomed = zoomAt(initialTransform(BOX, SQUARE), 3, 0, 0, BOX, SQUARE);
    const t = zoomAt(zoomed, 0.1, 0, 0, BOX, SQUARE);
    const size = displayedSize(t, BOX, SQUARE);
    expect(t.scale).toBe(MIN_SCALE);
    expect(size.width).toBeCloseTo(BOX);
    expect(t.x).toBeCloseTo(0);
  });
});

describe("toCropRect", () => {
  it("가로 사진은 가운데 정사각을 잘라낸다", () => {
    const rect = toCropRect(initialTransform(BOX, LANDSCAPE), BOX, LANDSCAPE);
    expect(rect.size).toBeCloseTo(LANDSCAPE.height, 3);
    expect(rect.sx).toBeCloseTo((LANDSCAPE.width - LANDSCAPE.height) / 2, 3);
    expect(rect.sy).toBeCloseTo(0, 3);
  });

  it("세로 사진은 위아래 가운데를 잘라낸다", () => {
    const rect = toCropRect(initialTransform(BOX, PORTRAIT), BOX, PORTRAIT);
    expect(rect.size).toBeCloseTo(PORTRAIT.width, 3);
    expect(rect.sx).toBeCloseTo(0, 3);
    expect(rect.sy).toBeCloseTo((PORTRAIT.height - PORTRAIT.width) / 2, 3);
  });

  it("두 배로 확대하면 잘라내는 영역이 절반이 된다", () => {
    const start = initialTransform(BOX, SQUARE);
    const zoomed = zoomAt(start, 2, BOX / 2, BOX / 2, BOX, SQUARE);
    const rect = toCropRect(zoomed, BOX, SQUARE);
    expect(rect.size).toBeCloseTo(SQUARE.width / 2, 3);
  });

  it("잘라낸 영역이 원본 밖으로 나가지 않는다", () => {
    for (const photo of [LANDSCAPE, PORTRAIT, SQUARE]) {
      for (const input of [
        { scale: 9, x: 9999, y: 9999 },
        { scale: 1, x: -9999, y: -9999 },
      ]) {
        const rect = toCropRect(input, BOX, photo);
        expect(rect.sx).toBeGreaterThanOrEqual(-0.001);
        expect(rect.sy).toBeGreaterThanOrEqual(-0.001);
        expect(rect.sx + rect.size).toBeLessThanOrEqual(photo.width + 0.001);
        expect(rect.sy + rect.size).toBeLessThanOrEqual(photo.height + 0.001);
      }
    }
  });
});

describe("clampTransform", () => {
  it("어떤 값이 들어와도 사진이 틀을 덮는다", () => {
    const cases = [
      { scale: 9, x: 999, y: -999 },
      { scale: 0.1, x: -999, y: 999 },
      { scale: Number.NaN, x: 0, y: 0 },
    ];
    for (const photo of [LANDSCAPE, PORTRAIT, SQUARE]) {
      for (const input of cases) {
        const t = clampTransform(input, BOX, photo);
        const size = displayedSize(t, BOX, photo);
        expect(t.scale).toBeGreaterThanOrEqual(MIN_SCALE);
        expect(t.scale).toBeLessThanOrEqual(MAX_SCALE);
        expect(t.x + size.width).toBeGreaterThanOrEqual(BOX - 0.001);
        expect(t.y + size.height).toBeGreaterThanOrEqual(BOX - 0.001);
      }
    }
  });
});
