export const PROGRESS_STAGES = [10, 30, 60, 100] as const;

export type ProgressStage = (typeof PROGRESS_STAGES)[number];

export function toProgressPercent(amount: number, targetAmount: number) {
  if (targetAmount <= 0) return 0;
  return Math.min(100, Math.max(0, (amount / targetAmount) * 100));
}

export function toProgressStage(percent: number): ProgressStage {
  if (percent > 60) return 100;
  if (percent > 30) return 60;
  if (percent > 10) return 30;
  return 10;
}
