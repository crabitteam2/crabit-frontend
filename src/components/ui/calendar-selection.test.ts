import { describe, it, expect } from "vitest";
import { selectDate, EMPTY_RANGE } from "./calendar-selection";
const empty = { pendingStart: null, range: EMPTY_RANGE };
describe("calendar selection", () => {
  it("publishes optional start immediately", () =>
    expect(selectDate(empty, "2026.08.21").range).toEqual({
      start: "2026.08.21",
      end: null,
    }));
  it("permits same-day ranges", () =>
    expect(
      selectDate(selectDate(empty, "2026.08.21"), "2026.08.21").range,
    ).toEqual({ start: "2026.08.21", end: "2026.08.21" }));
  it("preserves reversed endpoints for validation instead of silently swapping them", () =>
    expect(
      selectDate(selectDate(empty, "2026.08.27"), "2026.08.21").range,
    ).toEqual({ start: "2026.08.27", end: "2026.08.21" }));
});
