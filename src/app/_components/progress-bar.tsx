const milestones = [10, 30, 60, 100];

interface ProgressBarProps {
  percent: number;
}

export function ProgressBar({ percent }: ProgressBarProps) {
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
      <div className="flex justify-between pr-[10px] pl-[18px]">
        {milestones.map((milestone) => (
          <span
            key={milestone}
            className="text-b2 text-fg-neutral w-[34.5px] text-center leading-[19px] whitespace-nowrap"
          >
            {milestone}%
          </span>
        ))}
      </div>
    </div>
  );
}
