"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import dividerImage from "@/../public/images/wishes/receipt-divider.svg";
import successImage from "@/../public/images/wishes/success.svg";
import { takeAdjustReceipt, type AdjustReceipt } from "./adjust-receipt";

interface AdjustDoneScreenProps {
  /** 꺼낸 뒤 카드에 남은 금액입니다. */
  balance: number;
}

/** 잔액 조정을 마친 뒤 위시별로 꺼낸 금액을 보여줍니다. */
export function AdjustDoneScreen({ balance }: AdjustDoneScreenProps) {
  const router = useRouter();
  const [receipt, setReceipt] = useState<AdjustReceipt | null>(null);
  const readRef = useRef(false);

  useEffect(() => {
    if (readRef.current) return;
    readRef.current = true;

    const found = takeAdjustReceipt();
    if (found === null) {
      router.replace("/");
      return;
    }
    setReceipt(found);
  }, [router]);

  if (receipt === null) return null;

  return (
    <div className="bg-gray-1 relative flex min-h-dvh flex-col">
      <div className="bg-pink-1 absolute inset-x-0 top-0 h-[389px]" />

      <div className="relative flex justify-center pt-[50px]">
        <Image src={successImage} alt="" width={120} height={120} priority />
      </div>

      <div className="relative flex flex-col items-center px-4 pt-3 pb-10">
        <p className="text-t2 text-fg-neutral pb-[10px] font-semibold">
          크래빗 카드로 돌아간 금액
        </p>
        <p className="text-h1 text-fg-neutral font-bold">
          {receipt.total.toLocaleString("ko-KR")}원
        </p>
      </div>

      <div className="relative mt-[2px] px-4">
        <div className="border-pink-4 bg-pink-3 h-6 rounded-full border-2" />

        <div className="relative -mt-[10px] flex justify-center">
          <div className="w-[326px] overflow-hidden rounded-[20px] bg-white">
            {receipt.items.map((item, index) => (
              <div key={`${item.label}-${index}`} className="relative">
                {index === 0 ? null : (
                  <Image
                    src={dividerImage}
                    alt=""
                    width={275}
                    height={2}
                    className="absolute top-0 left-[26px] h-[2px] w-[274.5px]"
                  />
                )}
                <div className="px-8 pt-10 pb-7">
                  <p className="text-fg-neutral pb-1 text-[16px] leading-[28px] font-medium tracking-[-0.3px]">
                    {item.label}
                  </p>
                  <p className="text-pink-6 text-[22px] leading-[34px] font-bold tracking-[-0.3px]">
                    {item.amount.toLocaleString("ko-KR")} 원
                  </p>
                </div>
              </div>
            ))}

            <div className="relative">
              <Image
                src={dividerImage}
                alt=""
                width={275}
                height={2}
                className="absolute top-0 left-[26px] h-[2px] w-[274.5px]"
              />
              <div className="px-8 pt-10 pb-7">
                <p className="text-gray-6 pb-1 text-[16px] leading-[28px] font-medium tracking-[-0.3px]">
                  꺼내기 후 카드 잔액
                </p>
                <p className="text-gray-6 text-[22px] leading-[34px] font-bold tracking-[-0.3px]">
                  {balance.toLocaleString("ko-KR")} 원
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-action relative mt-auto px-4 pt-10">
        <Link
          href="/"
          replace
          className="bg-brand-solid text-fg-contrast text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
