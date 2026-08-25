import type { CardAccount } from "@/lib/mock/accounts";

interface CardBalanceCardProps {
  account: CardAccount;
  isSelected?: boolean;
}

export function CardBalanceCard({ account, isSelected }: CardBalanceCardProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[20px] px-9 pt-7 pb-4 ${isSelected ? "bg-pink-3" : "bg-pink-1"}`}
    >
      <p className="text-t3 text-fg-neutral truncate pb-[10px] font-medium">
        {account.name}
      </p>
      <p className="text-fg-neutral box-content h-[34px] pb-[60px] font-bold tracking-[-0.3px]">
        <span className="text-[28px] leading-[34px]">
          {account.balance.toLocaleString("ko-KR")}
        </span>
        <span className="text-[26px] leading-[34px]">&nbsp;원</span>
      </p>
      <p className="text-t3 text-fg-neutral truncate pb-1 font-medium">
        {account.cardNumber}
      </p>
    </div>
  );
}
