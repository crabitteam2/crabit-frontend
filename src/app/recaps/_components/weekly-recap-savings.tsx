interface WeeklyRecapSavingsProps {
  /** 지난주 저축 횟수와 연속 주차를 알리는 문구입니다. */
  headline: string;
  /** 지난주에 모은 금액입니다. */
  netSavings: number;
  /** 지난주에 새로 만든 위시 개수입니다. */
  newWishCount: number;
}

/** 지난주 저축 성과를 보여주는 주간 리캡 첫째 장입니다. */
export function WeeklyRecapSavings({
  headline,
  netSavings,
  newWishCount,
}: WeeklyRecapSavingsProps) {
  return (
    <>
      <p className="text-fg-neutral px-4 pt-5 pb-[100px] text-[20px] leading-7 font-medium tracking-[-0.3px] break-keep whitespace-pre-line">
        {headline}
      </p>

      <SavingCard
        value={netSavings.toLocaleString("ko-KR")}
        unit="원"
        label="모인 금액"
      />
      <SavingCard value={`${newWishCount} 개`} label="새로 등록한 위시" />
    </>
  );
}

function SavingCard({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <div className="px-4 pb-[60px]">
      <div className="bg-pink-1 text-fg-neutral flex flex-col justify-center rounded-[15px] px-9 py-5 tracking-[-0.3px]">
        <p className="font-bold">
          <span className="text-[30px] leading-10">{value}</span>
          {unit === undefined ? null : (
            <span className="text-[28px] leading-[34px]"> {unit}</span>
          )}
        </p>
        <p className="text-[16px] leading-[23px] font-medium">{label}</p>
      </div>
    </div>
  );
}
