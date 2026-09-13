import { describe, expect, test } from "vitest";
import {
  toDisplayPercent,
  toProgressPercent,
  toProgressStage,
} from "./progress-stage";

describe("toProgressPercent", () => {
  test("returns the ratio as a percentage", () => {
    expect(toProgressPercent(5000, 50000)).toBe(10);
  });

  test("returns 0 when the target is not positive", () => {
    expect(toProgressPercent(5000, 0)).toBe(0);
  });

  test("clamps above the target to 100", () => {
    expect(toProgressPercent(60000, 50000)).toBe(100);
  });
});

describe("toProgressStage", () => {
  test.each([
    [0, 10],
    [1, 10],
    [10, 10],
    [10.1, 30],
    [11, 30],
    [30, 30],
    [30.1, 60],
    [31, 60],
    [60, 60],
    [60.1, 100],
    [61, 100],
    [100, 100],
  ])("maps %s%% to stage %s", (percent, stage) => {
    expect(toProgressStage(percent)).toBe(stage);
  });
});

describe("toDisplayPercent", () => {
  test("목표에 닿지 않으면 100으로 읽지 않는다", () => {
    expect(toDisplayPercent(toProgressPercent(49_999, 50_000))).toBe(99);
  });

  test("목표에 닿으면 100으로 읽는다", () => {
    expect(toDisplayPercent(toProgressPercent(50_000, 50_000))).toBe(100);
  });

  test("서버가 준 정수는 그대로 읽는다", () => {
    expect(toDisplayPercent(99)).toBe(99);
  });
});
