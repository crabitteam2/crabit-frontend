import Image from "next/image";
import { WishProgressBar } from "@/app/wishes/_components/wish-progress-bar";
import { sourceWishTheme } from "@/app/wishes/_components/wish-theme";
import radioOffIcon from "@/../public/images/common/radio-off.svg";
import radioOnIcon from "@/../public/images/common/radio-on.svg";

interface AdjustSourceCardProps {
  label: string;
  amount: number;
  percent: number;
  isSelected: boolean;
}

export function AdjustSourceCard({
  label,
  amount,
  percent,
  isSelected,
}: AdjustSourceCardProps) {
  return (
    <div className="bg-pink-1 flex flex-col overflow-hidden rounded-[20px] px-9 pt-7 pb-[10px]">
      <div className="flex w-full items-center justify-between pb-[10px]">
        <p className="text-t3 text-fg-neutral flex-1 truncate font-medium">
          {label}
        </p>
        <Image
          src={isSelected ? radioOnIcon : radioOffIcon}
          alt=""
          width={32}
          height={32}
          className="size-8 shrink-0"
        />
      </div>

      <p className="text-fg-neutral box-content h-[34px] pb-7 font-bold tracking-[-0.3px]">
        <span className="text-[28px] leading-[34px]">
          {amount.toLocaleString("ko-KR")}
        </span>
        <span className="text-[26px] leading-[34px]">&nbsp;원</span>
      </p>

      <WishProgressBar percent={percent} theme={sourceWishTheme} />
    </div>
  );
}
