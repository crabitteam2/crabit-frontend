const milestoneRatios = [0.25, 0.5, 0.75];

function formatAmountLabel(amount: number) {
  if (amount % 1000 !== 0) return `${amount.toLocaleString("ko-KR")}원`;

  const man = Math.floor(amount / 10000);
  const cheon = Math.floor((amount % 10000) / 1000);
  if (man === 0 && cheon === 0) return "0원";

  return `${man === 0 ? "" : `${man}만`}${cheon === 0 ? "" : `${cheon}천`}원`;
}

function toMilestoneAmounts(targetAmount: number) {
  const unit = targetAmount < 8000 ? 100 : 1000;
  const leading = milestoneRatios.map(
    (ratio) => Math.floor((targetAmount * ratio) / unit) * unit,
  );
  return [...leading, targetAmount];
}

interface ProgressBarProps {
  percent: number;
  targetAmount: number;
}

export function ProgressBar({ percent, targetAmount }: ProgressBarProps) {
  return (
    <div className="flex h-[75px] flex-col gap-[18px]">
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="bg-pink-1 h-7 overflow-hidden rounded-full"
      >
        <div
          className="bg-pink-5 h-full rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between pr-[6px] pl-[28px]">
        {toMilestoneAmounts(targetAmount).map((amount, index) => (
          <span
            key={index}
            className="text-b2 text-fg-neutral text-center leading-[19px] whitespace-nowrap"
          >
            {formatAmountLabel(amount)}
          </span>
        ))}
      </div>
    </div>
  );
}
