interface CardBalanceCardProps {
  name: string;
  cardNumber: string;
  balance: number | null;
  isSelected?: boolean;
}

export function CardBalanceCard({
  name,
  cardNumber,
  balance,
  isSelected,
}: CardBalanceCardProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[20px] px-9 pt-7 pb-4 ${isSelected ? "bg-pink-3" : "bg-pink-1"}`}
    >
      <p className="text-t3 text-fg-neutral truncate pb-[10px] font-medium">
        {name}
      </p>
      {balance === null ? (
        <p className="text-fg-neutral-subtle box-content flex h-[34px] items-center pb-[60px] text-[18px] leading-[34px] font-semibold tracking-[-0.3px]">
          잔액을 확인하지 못했어요
        </p>
      ) : (
        <p className="text-fg-neutral box-content h-[34px] pb-[60px] font-bold tracking-[-0.3px]">
          <span className="text-[28px] leading-[34px]">
            {balance.toLocaleString("ko-KR")}
          </span>
          <span className="text-[26px] leading-[34px]">&nbsp;원</span>
        </p>
      )}
      <p className="text-t3 text-fg-neutral truncate pb-1 font-medium">
        {cardNumber}
      </p>
    </div>
  );
}
