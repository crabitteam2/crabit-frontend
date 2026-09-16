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
    expect(previous.scale).toBeCloseTo(0.5);
    expect(previous.rotation).toBe(7.5);
    expect(previous.turn).toBe(-12);
  });
  it("keeps the early fall large and finishes fitting smoothly just before contact", () => {
    expect(fallPose(0.2).scale).toBe(1);
    expect(fallPose(0.2).rotation).toBe(0);
    expect(fallPose(0.2 + 0.0001).scale).toBeCloseTo(1, 6);
    expect(fallPose(0.48).scale).toBeGreaterThan(0.76);
    expect(fallPose(0.78 - 0.0001).scale).toBeCloseTo(0.5, 6);
    expect(fallPose(0.78).scale).toBe(0.5);
    expect(fallPose(0.78 + 0.0001).scale).toBe(0.5);
  });
  it("fits every rotated corner inside the slot before contact and throughout occlusion", () => {
    const corners = projectedInkCorners(0.78);
    const width =
      Math.max(...corners.map((p) => p.x)) -
      Math.min(...corners.map((p) => p.x));
    expect(width).toBeGreaterThan(48);
    expect(width).toBeLessThan(48.3);
    const occluded = (t: number) =>
      projectedInkCorners(t).filter((p) => p.y >= frontEdgeY(p.x)).length;
    expect(occluded(0.78)).toBe(0);
    expect(occluded(0.816)).toBe(0);
    expect(occluded(0.817)).toBeGreaterThan(0);
    expect(occluded(0.85)).toBe(2);
    expect(occluded(1)).toBe(4);
    for (let frame = 780; frame <= 1000; frame++) {
      const progress = frame / 1000;
      for (const point of projectedInkCorners(progress)) {
        expect(point.x).toBeGreaterThan(SLOT.left + 0.8);
        expect(point.x).toBeLessThan(SLOT.right - 0.8);
      }
      expect(occluded(progress)).toBeGreaterThanOrEqual(
        occluded((frame - 1) / 1000),
      );
    }
  });
});
