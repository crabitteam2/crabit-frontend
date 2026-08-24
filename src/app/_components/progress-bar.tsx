const milestones = [10, 30, 60, 100];

/** 저축 진행률 막대에 표시할 값입니다. */
interface ProgressBarProps {
  /** 호출자가 계산한 진행률입니다. 일반 사용 경로에서는 0에서 100 사이입니다. */
  percent: number;
}

/** 현재 진행률과 10·30·60·100% 이정표를 함께 표시합니다. */
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
