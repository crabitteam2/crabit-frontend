import type { WishTheme } from "./wish-theme";

const MILESTONES = [10, 40, 70, 100];

interface WishProgressBarProps {
  percent: number;
  theme: WishTheme;
}

export function WishProgressBar({ percent, theme }: WishProgressBarProps) {
  return (
    <div className="flex flex-col gap-2 pt-5 pb-[10px]">
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`h-4 w-full overflow-hidden rounded-full ${theme.track}`}
      >
        {theme.fill === "" ? null : (
          <div
            className={`h-full rounded-full ${theme.fill}`}
            style={{ width: theme.fillsTrack ? "100%" : `${percent}%` }}
          />
        )}
      </div>
      <div className="text-fg-neutral flex items-center justify-between pl-[30px] text-[11px] leading-4 tracking-[-0.3px]">
        {MILESTONES.map((milestone) => (
          <span
            key={milestone}
            className={
              theme.highlightsGoal && milestone === 100
                ? "text-pink-6 font-semibold"
                : ""
            }
          >
            {milestone}%
          </span>
        ))}
      </div>
    </div>
  );
}
