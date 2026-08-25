import { toProgressPercent } from "@/app/_components/progress-stage";
import type { Wish } from "@/lib/mock/wishes";
import { WishProgressBar } from "./wish-progress-bar";
import { sourceWishTheme } from "./wish-theme";

interface WishSourceCardProps {
  wish: Wish;
  isSelected?: boolean;
}

export function WishSourceCard({ wish, isSelected }: WishSourceCardProps) {
  const percent = toProgressPercent(wish.amount, wish.targetAmount);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[20px] px-9 pt-7 pb-4 ${isSelected ? "bg-pink-3" : "bg-pink-1"}`}
    >
      <p className="text-t3 text-fg-neutral truncate pb-[10px] font-medium">
        {wish.purpose}
      </p>
      <p className="text-fg-neutral box-content h-[34px] pb-7 font-bold tracking-[-0.3px]">
        <span className="text-[28px] leading-[34px]">
          {wish.amount.toLocaleString("ko-KR")}
        </span>
        <span className="text-[26px] leading-[34px]">&nbsp;원</span>
      </p>
      <WishProgressBar percent={percent} theme={sourceWishTheme} compact />
    </div>
  );
}
