export const PURPOSE_MAX_LENGTH = 200;
export function normalizePurpose(value: string) {
  return value.replace(/^\p{Zs}+|\p{Zs}+$/gu, "").normalize("NFC");
}
export function purposeError(value: string): string | undefined {
  if (/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u.test(value)) return "줄바꿈이나 보이지 않는 문자는 사용할 수 없어요.";
  const length = [...normalizePurpose(value)].length;
  if (length === 0) return "위시를 입력해주세요.";
  if (length > PURPOSE_MAX_LENGTH) return "위시는 200자 이내로 입력해주세요.";
}
export function parseKrw(value: string): number | null {
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value)) return null;
  const digits = value.replace(/,/g, "").replace(/^0+/, "") || "0";
  const maximum = String(Number.MAX_SAFE_INTEGER);
  if (digits.length > maximum.length || (digits.length === maximum.length && digits > maximum)) return null;
  const amount = Number(digits);
  return amount > 0 ? amount : null;
}
export function amountError(value: string, maximum?: number, minimum?: number): string | undefined {
  const amount = parseKrw(value);
  if (value === "") return "금액을 입력해주세요.";
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value)) return "금액은 원 단위 숫자로 입력해주세요.";
  if (/^0+$/.test(value.replace(/,/g, ""))) return "금액은 1원 이상 입력해주세요.";
  if (amount === null) return "금액은 9,007,199,254,740,991원 이하로 입력해주세요.";
  if (maximum !== undefined && amount > maximum) return "사용 가능한 금액을 넘었어요.";
  if (minimum !== undefined && amount < minimum) return "현재 모인 금액보다 작게 설정할 수 없어요.";
}
/** Format only verified input, on blur, so editing does not move the caret. */
export function formatKrw(value: string) {
  const amount = parseKrw(value);
  return amount === null ? value : amount.toLocaleString("ko-KR");
}
export function isCalendarDate(value: string) {
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split(".").map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]!;
}
export interface Period { start: string | null; end: string | null }
export function periodError(range: Period): string | undefined {
  if ((range.start !== null && !isCalendarDate(range.start)) || (range.end !== null && !isCalendarDate(range.end))) return "실제 존재하는 날짜를 선택해주세요.";
  if (range.start !== null && range.end !== null && range.start > range.end) return "시작일은 목표일보다 늦을 수 없어요.";
}
