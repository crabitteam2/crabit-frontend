const CARD_NUMBER = "0000-0000-0000-0000";

/** 홈 탭 카드에 표시할 잔액 정보입니다. */
interface MyCardProps {
  /** 카드 소유자 이름입니다. */
  ownerName: string;
  /** 카드 잔액입니다. */
  balance: number;
  /** 위시에 넣을 수 있는 잔액입니다. */
  wishAvailableBalance: number;
}

/** 카드 잔액과 위시 사용 가능 잔액을 한 장의 카드로 표시합니다. */
export function MyCard({
  ownerName,
  balance,
  wishAvailableBalance,
}: MyCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] bg-[linear-gradient(160deg,rgba(253,237,244,0.8)_2.77%,rgba(251,117,187,0.8)_100%)] px-8 py-6">
      <p className="text-gray-8 pb-[10px] text-[14px] leading-[28px] font-medium tracking-[-0.3px]">
        {ownerName}의 크래빗 카드
      </p>
      <p className="text-static-white text-right leading-[34px] font-bold tracking-[-0.3px]">
        <span className="text-[28px]">{balance.toLocaleString("ko-KR")} </span>
        <span className="text-[26px]">원</span>
      </p>
      <p className="text-gray-7 pb-5 text-right text-[14px] leading-[34px] font-medium tracking-[-0.3px]">
        위시 사용 가능 잔액: {wishAvailableBalance.toLocaleString("ko-KR")} 원
      </p>
      <p className="text-gray-8 pb-1 text-[14px] leading-[28px] font-medium tracking-[-0.3px]">
        {CARD_NUMBER}
      </p>
    </div>
  );
}
