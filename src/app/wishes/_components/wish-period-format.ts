import type { DateRange } from "@/components/ui/calendar";

const SEPARATOR = " - ";
const FULL_DATE_PATTERN = /^\d{4}\.\d{2}\.\d{2}$/;
const SHORT_DATE_PATTERN = /^\d{2}\.\d{2}\.\d{2}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** `2026.08.21` 형태의 날짜 키를 표시용 `26.08.21`로 줄입니다. */
export function toShortDate(key: string) {
  return FULL_DATE_PATTERN.test(key) ? key.slice(2) : key;
}

/** 표시용 `26.08.21`을 달력이 쓰는 `2026.08.21` 키로 늘립니다. */
export function toFullDate(short: string) {
  return SHORT_DATE_PATTERN.test(short) ? `20${short}` : short;
}

/** 선택한 기간을 목표 기간 입력칸에 표시할 문자열로 바꿉니다. */
export function toPeriodLabel(range: DateRange) {
  if (range.start === null)
    return range.end === null ? "" : `목표일 ${toShortDate(range.end)}`;
  if (range.end === null) return toShortDate(range.start);
  return `${toShortDate(range.start)}${SEPARATOR}${toShortDate(range.end)}`;
}

/** 저축 기간을 카드와 완료 화면에 표시할 문자열로 바꿉니다. */
export function toSavingPeriodLabel(range: DateRange) {
  if (range.start === null)
    return range.end === null ? "" : `목표일 ${toShortDate(range.end)}`;
  if (range.end === null) return toShortDate(range.start);
  return `${toShortDate(range.start)} ~ ${toShortDate(range.end)}`;
}

/** 목표 기간 표시 문자열을 달력이 쓰는 기간으로 되돌립니다. */
export function fromPeriodLabel(label: string | null): DateRange {
  if (label === null || label === "") return { start: null, end: null };

  if (label.startsWith("목표일 "))
    return { start: null, end: toFullDate(label.slice(4)) };
  const [start, end] = label.split(SEPARATOR);
  if (start === undefined) return { start: null, end: null };
  return {
    start: toFullDate(start),
    end: end === undefined ? null : toFullDate(end),
  };
}

/** 선택한 기간을 다음 화면으로 넘길 쿼리 값으로 바꿉니다. */
export function toPeriodParams(range: DateRange) {
  const params = new URLSearchParams();
  if (range.start !== null)
    params.set("startDate", range.start.replaceAll(".", "-"));
  if (range.end !== null)
    params.set("targetDate", range.end.replaceAll(".", "-"));
  return params;
}

/** 달력이 쓰는 `2026.09.05` 키를 API가 받는 `2026-09-05`로 바꾸며, 형식이 다르면 null입니다. */
export function toIsoDate(key: string | null | undefined): string | null {
  if (key == null) return null;
  return FULL_DATE_PATTERN.test(key) ? key.replaceAll(".", "-") : null;
}

/** API가 준 `2026-09-05`를 달력이 쓰는 `2026.09.05` 키로 바꾸며, 형식이 다르면 null입니다. */
export function fromIsoDate(iso: string | null | undefined): string | null {
  if (iso == null) return null;
  return ISO_DATE_PATTERN.test(iso) ? iso.replaceAll("-", ".") : null;
}
