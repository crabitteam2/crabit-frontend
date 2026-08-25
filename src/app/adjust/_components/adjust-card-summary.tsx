const CARD_GRADIENT =
  "linear-gradient(159.55deg, rgba(253, 237, 244, 0.8) 2.77%, rgba(251, 117, 187, 0.8) 100%)";

interface AdjustCardSummaryProps {
  label: string;
  balance: number;
  shortage: number;
  cardNumber: string;
}

export function AdjustCardSummary({
  label,
  balance,
  shortage,
  cardNumber,
}: AdjustCardSummaryProps) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-[20px] px-9 pt-7 pb-4"
      style={{ backgroundImage: CARD_GRADIENT }}
    >
      <p className="text-t3 text-gray-7 truncate pb-[10px] font-medium">
        {label}
      </p>

      <div className="flex flex-col items-end pb-[30px]">
        <p className="box-content h-[34px] font-bold tracking-[-0.3px] text-white">
          <span className="text-[28px] leading-[34px]">
            {balance.toLocaleString("ko-KR")}
          </span>
          <span className="text-[26px] leading-[34px]">&nbsp;원</span>
        </p>
        <p className="text-error text-[14px] leading-[34px] font-medium tracking-[-0.3px]">
          조정이 필요한 금액 : {shortage.toLocaleString("ko-KR")} 원
        </p>
      </div>

      <p className="text-t3 text-gray-7 truncate pb-1 font-medium">
        {cardNumber}
      </p>
    </div>
  );
}
