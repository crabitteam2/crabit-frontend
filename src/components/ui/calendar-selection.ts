import type { DateRange } from "./calendar";

export const EMPTY_RANGE: DateRange = { start: null, end: null };

/** 첫 번째 날짜만 고른 중간 상태와 확정된 기간을 함께 담습니다. */
export interface SelectionState {
  /** 시작만 고르고 아직 끝을 고르지 않은 날짜입니다. */
  pendingStart: string | null;
  /** 시작과 끝이 모두 정해진 기간입니다. 하루짜리는 만들 수 없습니다. */
  range: DateRange;
}

/**
 * 날짜 하나를 누른 결과를 계산합니다.
 *
 * 첫 번째 누름은 시작일만 잡아 두고, 두 번째 누름에서 기간을 확정합니다.
 * 같은 날짜를 두 번 누르면 취소하므로 하루짜리 기간은 만들어지지 않습니다.
 * 두 번째 날짜가 시작일보다 앞서면 둘을 맞바꿉니다.
 */
export function selectDate(state: SelectionState, key: string): SelectionState {
  if (state.pendingStart === null) {
    return { pendingStart: key, range: EMPTY_RANGE };
  }

  if (key === state.pendingStart) {
    return { pendingStart: null, range: state.range };
  }

  const [start, end] =
    key < state.pendingStart
      ? [key, state.pendingStart]
      : [state.pendingStart, key];
  return { pendingStart: null, range: { start, end } };
}
