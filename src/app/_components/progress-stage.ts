/** 홈 캐릭터가 지원하는 오름차순 진행 단계입니다. */
export const PROGRESS_STAGES = [10, 30, 60, 100] as const;

/** 홈 캐릭터에 사용되는 진행 단계 값입니다. */
export type ProgressStage = (typeof PROGRESS_STAGES)[number];

/**
 * 현재 금액을 목표 금액 대비 백분율로 바꾸고 0에서 100 사이로 제한합니다.
 * 목표 금액이 0 이하이면 나눗셈 대신 0을 반환합니다.
 */
export function toProgressPercent(amount: number, targetAmount: number) {
  if (targetAmount <= 0) return 0;
  return Math.min(100, Math.max(0, (amount / targetAmount) * 100));
}

/**
 * 백분율을 다음 캐릭터 단계로 올림해 대응합니다.
 * 경계값 10·30·60은 각각 현재 단계에 남고, 60을 초과하면 100 단계가 됩니다.
 */
export function toProgressStage(percent: number): ProgressStage {
  if (percent > 60) return 100;
  if (percent > 30) return 60;
  if (percent > 10) return 30;
  return 10;
}
