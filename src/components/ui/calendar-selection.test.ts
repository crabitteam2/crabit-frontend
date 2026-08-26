import { describe, expect, it } from "vitest";
import {
  EMPTY_RANGE,
  selectDate,
  type SelectionState,
} from "./calendar-selection";

const empty: SelectionState = { pendingStart: null, range: EMPTY_RANGE };

describe("selectDate", () => {
  it("첫 누름은 시작일만 잡고 기간을 확정하지 않는다", () => {
    expect(selectDate(empty, "2026.08.21")).toEqual({
      pendingStart: "2026.08.21",
      range: EMPTY_RANGE,
    });
  });

  it("두 번째 누름에서 기간을 확정한다", () => {
    const started = selectDate(empty, "2026.08.21");
    expect(selectDate(started, "2026.08.27")).toEqual({
      pendingStart: null,
      range: { start: "2026.08.21", end: "2026.08.27" },
    });
  });

  it("같은 날짜를 두 번 누르면 취소하고 하루짜리를 만들지 않는다", () => {
    const started = selectDate(empty, "2026.08.21");
    expect(selectDate(started, "2026.08.21")).toEqual({
      pendingStart: null,
      range: EMPTY_RANGE,
    });
  });

  it("두 번째 날짜가 앞서면 시작과 끝을 맞바꾼다", () => {
    const started = selectDate(empty, "2026.08.27");
    expect(selectDate(started, "2026.08.21").range).toEqual({
      start: "2026.08.21",
      end: "2026.08.27",
    });
  });

  it("해를 넘겨도 문자열 비교로 순서를 가린다", () => {
    const started = selectDate(empty, "2027.01.03");
    expect(selectDate(started, "2026.12.28").range).toEqual({
      start: "2026.12.28",
      end: "2027.01.03",
    });
  });

  it("확정된 기간에서 새로 누르면 기존 기간을 지우고 다시 시작한다", () => {
    const confirmed: SelectionState = {
      pendingStart: null,
      range: { start: "2026.08.21", end: "2026.08.27" },
    };
    expect(selectDate(confirmed, "2026.09.01")).toEqual({
      pendingStart: "2026.09.01",
      range: EMPTY_RANGE,
    });
  });

  it("어떤 순서로 눌러도 하루짜리 기간은 확정되지 않는다", () => {
    const keys = ["2026.08.20", "2026.08.21", "2026.08.27"];
    for (const first of keys) {
      for (const second of keys) {
        const { range } = selectDate(selectDate(empty, first), second);
        if (range.start === null) {
          expect(range.end).toBeNull();
          continue;
        }
        expect(range.end).not.toBeNull();
        expect(range.end).not.toBe(range.start);
      }
    }
  });
});
