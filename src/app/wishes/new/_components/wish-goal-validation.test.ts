import { describe, expect, it } from "vitest";
import {
  isValidPurpose,
  isValidTargetAmount,
  normalizePurpose,
  PURPOSE_MAX_LENGTH,
  toTargetAmount,
} from "./wish-goal-validation";

describe("isValidPurpose", () => {
  it("한 글자부터 200자까지 허용한다", () => {
    expect(isValidPurpose("가")).toBe(true);
    expect(isValidPurpose("가".repeat(PURPOSE_MAX_LENGTH))).toBe(true);
  });

  it("201자를 거부한다", () => {
    expect(isValidPurpose("가".repeat(PURPOSE_MAX_LENGTH + 1))).toBe(false);
  });

  it("앞뒤 공백을 제거한 뒤 길이를 센다", () => {
    expect(isValidPurpose("  가  ")).toBe(true);
    expect(isValidPurpose(`  ${"가".repeat(PURPOSE_MAX_LENGTH)}  `)).toBe(true);
  });

  it("앞뒤 NBSP도 공백으로 제거한다", () => {
    expect(isValidPurpose(" 가 ")).toBe(true);
  });

  it("공백만 있으면 거부한다", () => {
    expect(isValidPurpose("")).toBe(false);
    expect(isValidPurpose("   ")).toBe(false);
    expect(isValidPurpose(" ")).toBe(false);
  });

  it("내부 공백은 보존한다", () => {
    expect(normalizePurpose(" 엄마 생신 선물 ")).toBe("엄마 생신 선물");
  });

  it("제어 문자와 서식 문자를 거부한다", () => {
    expect(isValidPurpose("가\n나")).toBe(false);
    expect(isValidPurpose("가\t나")).toBe(false);
    expect(isValidPurpose("가​나")).toBe(false);
    expect(isValidPurpose("가 나")).toBe(false);
  });

  it("결합 문자를 NFC로 합친 뒤 센다", () => {
    const decomposed = "가";
    expect(normalizePurpose(decomposed)).toBe("가");
    expect([...normalizePurpose(decomposed)]).toHaveLength(1);
  });

  it("서로게이트 쌍을 한 글자로 센다", () => {
    expect(isValidPurpose("🐰".repeat(PURPOSE_MAX_LENGTH))).toBe(true);
    expect(isValidPurpose("🐰".repeat(PURPOSE_MAX_LENGTH + 1))).toBe(false);
  });
});

describe("isValidTargetAmount", () => {
  it("1 이상 정수를 허용한다", () => {
    expect(isValidTargetAmount("1")).toBe(true);
    expect(isValidTargetAmount("50000")).toBe(true);
  });

  it("표시용 쉼표를 허용한다", () => {
    expect(isValidTargetAmount("50,000")).toBe(true);
  });

  it("0과 빈 값을 거부한다", () => {
    expect(isValidTargetAmount("0")).toBe(false);
    expect(isValidTargetAmount("")).toBe(false);
  });

  it("소수점을 거부한다", () => {
    expect(isValidTargetAmount("50.5")).toBe(false);
    expect(isValidTargetAmount("50.")).toBe(false);
  });

  it("음수와 숫자가 아닌 문자를 거부한다", () => {
    expect(isValidTargetAmount("-1")).toBe(false);
    expect(isValidTargetAmount("5만원")).toBe(false);
    expect(isValidTargetAmount(" 5")).toBe(false);
  });

  it("통과한 값만 정수로 바꾸고 나머지는 0이다", () => {
    expect(toTargetAmount("50,000")).toBe(50_000);
    expect(toTargetAmount("50.5")).toBe(0);
  });
});
