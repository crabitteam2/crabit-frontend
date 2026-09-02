import type { DateRange } from "./calendar";
export const EMPTY_RANGE: DateRange = { start: null, end: null };
export interface SelectionState {
  pendingStart: string | null;
  range: DateRange;
}
/** One click selects an optional start. A second click completes a range, including one day. */
export function selectDate(state: SelectionState, key: string): SelectionState {
  if (state.pendingStart === null)
    return { pendingStart: key, range: { start: key, end: null } };
  return { pendingStart: null, range: { start: state.pendingStart, end: key } };
}
