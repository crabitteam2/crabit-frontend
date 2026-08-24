import Image from "next/image";
import lockIcon from "@/../public/images/home/card-locked.svg";
import newWishIcon from "@/../public/images/home/quick-new-wish.svg";
import wishlistIcon from "@/../public/images/home/quick-wishlist.svg";

/** 위시 바로가기 카드의 잠금 상태입니다. */
interface QuickActionsProps {
  /** 잔액 조정이 필요하면 두 버튼을 모두 비활성화하고 잠금 오버레이를 표시합니다. */
  isLocked: boolean;
}

const cards = [
  {
    icon: wishlistIcon,
    lines: ["진행중/완료", "위시리스트"],
    background: "bg-pink-1",
  },
  {
    icon: newWishIcon,
    lines: ["새로운 위시", "등록하기"],
    background: "bg-[#f0f3ff]",
  },
];

/** 진행 위시 목록과 새 위시 등록 바로가기를 같은 잠금 상태로 렌더링합니다. */
export function QuickActions({ isLocked }: QuickActionsProps) {
  return (
    <div className="flex gap-4">
      {cards.map((card) => (
        <button
          key={card.lines.join()}
          type="button"
          disabled={isLocked}
          className={`relative flex flex-1 flex-col items-start gap-12 overflow-hidden rounded-[20px] p-4 text-left whitespace-nowrap ${card.background}`}
        >
          <span className="relative size-9">
            <Image src={card.icon} alt="" fill sizes="36px" />
          </span>
          <span className="text-t3 text-fg-neutral px-[10px] font-medium">
            {card.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
          {isLocked ? (
            <span className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Image src={lockIcon} alt="잠김" width={64} height={64} />
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
