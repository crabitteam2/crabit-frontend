import { describe, expect, it } from "vitest";
import {
  ALIGNED,
  COIN_INK,
  SLOT,
  SLOT_CENTER_X,
  fallPose,
  frontEdgeY,
  projectedInkCorners,
} from "./coin-drop-geometry";

describe("visible coin and slot geometry", () => {
  it("aligns the measured visible center rather than the PNG box", () => {
    expect(COIN_INK.width).toBeCloseTo(87.33, 2);
    expect(ALIGNED.x + COIN_INK.centerX).toBe(SLOT_CENTER_X);
    expect(SLOT.right - SLOT.left).toBeCloseTo(49.94, 2);
    expect(frontEdgeY(SLOT.right)).toBeGreaterThan(frontEdgeY(SLOT.left));
  });
  it("starts continuously at full size and turns gently while shrinking", () => {
    expect(fallPose(0)).toMatchObject({
      ...ALIGNED,
      scale: 1,
      rotation: 0,
      turn: -0,
    });
    expect(fallPose(0.0001).scale).toBeCloseTo(1, 6);
    let previous = fallPose(0);
    for (let frame = 1; frame <= 100; frame++) {
      const pose = fallPose(frame / 100);
      expect(pose.scale).toBeLessThanOrEqual(previous.scale);
      expect(pose.rotation).toBeGreaterThanOrEqual(previous.rotation);
      expect(pose.y).toBeGreaterThan(previous.y);
      previous = pose;
    }
    expect(previous.scale).toBeCloseTo(0.44);
    expect(previous.rotation).toBe(7.5);
    expect(previous.turn).toBe(-12);
  });
  it("fits inside the opening before contact and is progressively hidden by its front edge", () => {
    const corners = projectedInkCorners(0.68);
    const width =
      Math.max(...corners.map((p) => p.x)) -
      Math.min(...corners.map((p) => p.x));
    expect(width).toBeGreaterThan(42);
    expect(width).toBeLessThan(44);
    expect(Math.min(...corners.map((p) => p.x))).toBeGreaterThan(SLOT.left + 3);
    expect(Math.max(...corners.map((p) => p.x))).toBeLessThan(SLOT.right - 3);
    const occluded = (t: number) =>
      projectedInkCorners(t).filter((p) => p.y >= frontEdgeY(p.x)).length;
    expect(occluded(0.68)).toBe(0);
    expect(occluded(0.85)).toBe(2);
    expect(occluded(1)).toBe(4);
    for (let frame = 68; frame <= 100; frame++) {
      expect(occluded(frame / 100)).toBeGreaterThanOrEqual(
        occluded((frame - 1) / 100),
      );
    }
  });
});
