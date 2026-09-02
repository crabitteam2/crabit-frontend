export const PURPOSE_MAX_LENGTH = 200;

const FORBIDDEN_PURPOSE_PATTERN = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u;
const BOUNDARY_SPACE_PATTERN = /^\p{Zs}+|\p{Zs}+$/gu;
const DIGITS_ONLY_PATTERN = /^\d+$/;

/** 앞뒤 공백을 제거하고 NFC로 정규화한 목표 문자열을 돌려줍니다. */
export function normalizePurpose(value: string) {
  return value.replace(BOUNDARY_SPACE_PATTERN, "").normalize("NFC");
}

/** 목표가 스펙의 `Purpose` 제약을 만족하는지 검사합니다. */
export function isValidPurpose(value: string) {
  if (FORBIDDEN_PURPOSE_PATTERN.test(value)) return false;
  const length = [...normalizePurpose(value)].length;
  return length >= 1 && length <= PURPOSE_MAX_LENGTH;
}

/** 표시용 쉼표를 제거한 금액 입력값을 돌려줍니다. */
export function stripAmountSeparators(value: string) {
  return value.replace(/,/g, "");
}

/** 목표 금액이 스펙의 `KrwPositive` 제약을 만족하는지 검사합니다. */
export function isValidTargetAmount(value: string) {
  const digits = stripAmountSeparators(value);
  if (!DIGITS_ONLY_PATTERN.test(digits)) return false;
  return Number(digits) >= 1;
}

/** 검증을 통과한 금액 입력값을 정수로 바꿉니다. 통과하지 못하면 0입니다. */
export function toTargetAmount(value: string) {
  return isValidTargetAmount(value) ? Number(stripAmountSeparators(value)) : 0;
}
