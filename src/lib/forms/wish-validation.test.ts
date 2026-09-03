import { describe, it, expect } from "vitest";
import { parseKrw, amountError, purposeError, normalizePurpose, isCalendarDate, periodError } from "./wish-validation";
import { readWishQuery, readAmountQuery, serializeWish } from "./wish-form-query";
import { depositContext } from "./wish-amount-context";
import { findWish } from "@/lib/mock/wishes";
describe("form input boundaries", () => {
  it.each(["-100", "1.5", "1e3", "12,34", ",100", "100,", "hello", "0", "", "9007199254740992", "99999999999999999999"])("rejects %s without coercion", raw => expect(parseKrw(raw)).toBeNull());
  it.each([["1", 1], ["1,000", 1000], ["9007199254740991", Number.MAX_SAFE_INTEGER], ["000001", 1]] as const)("accepts exact %s", (raw, value) => expect(parseKrw(raw)).toBe(value));
  it("checks distinct lower and upper limits", () => { expect(amountError("10", 9)).toBeTruthy(); expect(amountError("9", undefined, 10)).toBeTruthy(); expect(amountError("10", 10, 10)).toBeUndefined(); });
  it("normalizes Unicode and counts code points", () => { expect(normalizePurpose(" 가 ")).toBe("가"); expect(purposeError("🐰".repeat(200))).toBeUndefined(); expect(purposeError("🐰".repeat(201))).toBeTruthy(); });
  it.each([" ", "\t가", "가\u200b", "가\u2028", "가\u2029"])("rejects invalid purpose %j", value => expect(purposeError(value)).toBeTruthy());
  it("validates leap years without rollover", () => { expect(isCalendarDate("2024.02.29")).toBe(true); expect(isCalendarDate("2026.02.29")).toBe(false); expect(isCalendarDate("1900.02.29")).toBe(false); expect(isCalendarDate("2000.02.29")).toBe(true); expect(isCalendarDate("2026.04.31")).toBe(false); });
  it("allows optional, same-day and past dates but rejects reversal", () => { expect(periodError({ start: null, end: "2020.01.01" })).toBeUndefined(); expect(periodError({ start: "2020.01.01", end: "2020.01.01" })).toBeUndefined(); expect(periodError({ start: "2020.01.02", end: "2020.01.01" })).toBeTruthy(); });
  it("rejects malformed direct queries and duplicate parameters", () => { const base = { purpose: "위시", targetAmount: "30000" }; expect(readWishQuery({ ...base, startDate: "2026-02-30" })).toBeNull(); expect(readWishQuery({ ...base, targetAmount: ["10", "20"] })).toBeNull(); expect(readWishQuery({ ...base, targetAmount: "1e3" })).toBeNull(); expect(readAmountQuery({ amount: "11" }, 10)).toBeNull(); });
  it("preserves omitted dates and clears explicit empty dates", () => { const defaults = { purpose: "위시", targetAmount: 100, currentAmount: 50, range: { start: "2026.01.01", end: "2026.12.31" } }; expect(readWishQuery({}, defaults)?.range).toEqual(defaults.range); expect(readWishQuery({ startDate: "", targetDate: "" }, defaults)?.range).toEqual({ start: null, end: null }); expect(readWishQuery({ purpose: "" }, defaults)).toBeNull(); expect(readWishQuery({ targetAmount: "49" }, defaults)).toBeNull(); });
  it("serializes ISO dates separately from calendar keys", () => { const values = readWishQuery({ purpose: "위시", targetAmount: "1", targetDate: "2026-12-31" })!; expect(serializeWish(values).get("targetDate")).toBe("2026-12-31"); });
  it("derives both deposit limits from the selected source", () => { const wish = findWish("w4")!; expect(depositContext(wish, { from: "w2" })).toEqual({ from: "w2", available: 6500, remaining: 1500, maximum: 1500 }); expect(depositContext(wish, { from: "missing" })).toBeNull(); expect(depositContext(wish, { from: "w4" })).toBeNull(); expect(depositContext(wish, { from: "a1" })?.available).toBe(20000); });
});
