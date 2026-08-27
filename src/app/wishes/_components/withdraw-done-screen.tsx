import Image from "next/image";
import Link from "next/link";
import dividerImage from "@/../public/images/wishes/receipt-divider.svg";
import receiptImage from "@/../public/images/wishes/receipt.svg";
import successImage from "@/../public/images/wishes/success.svg";

interface WithdrawDoneScreenProps {
  purpose: string;
  amount: number;
  balanceAfter: number;
}

export function WithdrawDoneScreen({
  purpose,
  amount,
  balanceAfter,
}: WithdrawDoneScreenProps) {
  return (
    <div className="bg-gray-1 relative flex min-h-svh flex-col">
      <div className="bg-pink-1 absolute inset-x-0 top-0 h-[389px]" />

      <div className="relative flex justify-center pt-[50px]">
        <Image src={successImage} alt="" width={120} height={120} priority />
      </div>

      <div className="relative flex flex-col items-center px-4 pt-3 pb-10">
        <p className="text-t2 text-fg-neutral pb-[10px] font-semibold">
          크래빗 카드로 돌아간 금액
        </p>
        <p className="text-h1 text-fg-neutral font-bold">
          {amount.toLocaleString("ko-KR")}원
        </p>
      </div>

      <div className="relative mt-[2px] px-4">
        <div className="border-pink-4 bg-pink-3 h-6 rounded-full border-2" />

        <div className="relative -mt-[10px] flex justify-center">
          <div className="relative h-[271px] w-[326px]">
            <Image src={receiptImage} alt="" fill sizes="326px" />

            <div className="absolute inset-x-0 top-0 px-8 pt-10 pb-7">
              <p className="text-fg-neutral pb-1 text-[16px] leading-[28px] font-medium tracking-[-0.3px]">
                {purpose}
              </p>
              <p className="text-pink-6 text-[22px] leading-[34px] font-bold tracking-[-0.3px]">
                {amount.toLocaleString("ko-KR")} 원
              </p>
            </div>

            <Image
              src={dividerImage}
              alt=""
              width={275}
              height={2}
              className="absolute top-[134.5px] left-[26px] h-[2px] w-[274.5px]"
            />

            <div className="absolute inset-x-0 top-[134px] px-8 pt-10 pb-7">
              <p className="text-gray-6 pb-1 text-[16px] leading-[28px] font-medium tracking-[-0.3px]">
                꺼내기 후 위시에 남은 금액
              </p>
              <p className="text-gray-6 text-[22px] leading-[34px] font-bold tracking-[-0.3px]">
                {balanceAfter.toLocaleString("ko-KR")} 원
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-auto px-4 pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Link
          href="/"
          className="bg-brand-solid text-fg-contrast text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
