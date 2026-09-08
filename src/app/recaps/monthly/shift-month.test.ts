import { describe, expect, it } from "vitest";
import { shiftMonth } from "./monthly-recap-view";

describe("shiftMonth", () => {
  it.each([
    ["2026-08-01", -1, "2026-07"],
    ["2026-08-01", -3, "2026-05"],
    ["2026-01-01", -1, "2025-12"],
    ["2026-12-01", 1, "2027-01"],
  ])("%s에서 %s달 옮기면 %s이다", (startDate, offset, expected) => {
    expect(shiftMonth(startDate, offset)).toBe(expected);
  });
});
