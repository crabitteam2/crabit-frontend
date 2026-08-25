"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import closeIcon from "@/../public/images/wishes/close-32.svg";
import { CoinDrop } from "./coin-drop";

const DOT_PATTERN =
  "radial-gradient(ellipse 14.13px 17.17px at 14.13px 17.17px, var(--color-pink-2) 0 100%, transparent 0)";

interface DepositCoinScreenProps {
  wishId: string;
  amount: number;
}

export function DepositCoinScreen({ wishId, amount }: DepositCoinScreenProps) {
  const router = useRouter();

  return (
    <div
      className="bg-pink-1 relative min-h-svh overflow-hidden"
      style={{
        backgroundImage: DOT_PATTERN,
        backgroundSize: "90.43px 109.91px",
        backgroundPosition: "0 -5px",
      }}
    >
      <CoinDrop
        onDrop={() =>
          router.push(`/wishes/${wishId}/deposit/done?amount=${amount}`)
        }
      />

      <div className="pointer-events-none relative">
        <div className="flex justify-end px-4 pt-[calc(env(safe-area-inset-top)+12px)]">
          <Link
            href={`/wishes/${wishId}`}
            aria-label="닫기"
            className="pointer-events-auto relative block size-8"
          >
            <Image src={closeIcon} alt="" fill sizes="32px" />
          </Link>
        </div>

        <h1 className="text-t1 text-fg-neutral px-4 pt-[26px] text-center font-bold">
          동전을 끌어서
          <br />
          저금통에 넣어보세요
        </h1>
      </div>
    </div>
  );
}
