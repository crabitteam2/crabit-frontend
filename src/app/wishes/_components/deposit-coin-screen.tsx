"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import closeIcon from "@/../public/images/wishes/close-32.svg";
import { Toast } from "@/components/ui/toast";
import { depositToWishAction, transferWishFundsAction } from "../wish-actions";
import { CoinDrop } from "./coin-drop";
import type { FundCounterpartRef } from "./fund-counterpart";

const DOT_PATTERN =
  "radial-gradient(ellipse 14.13px 17.17px at 14.13px 17.17px, var(--color-pink-2) 0 100%, transparent 0)";

interface DepositCoinScreenProps {
  wishId: string;
  amount: number;
  expectedVersion: number;
  source: FundCounterpartRef;
}

export function DepositCoinScreen({
  wishId,
  amount,
  expectedVersion,
  source,
}: DepositCoinScreenProps) {
  const router = useRouter();
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [attempt, setAttempt] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const drop = async () => {
    if (isPending) return;
    setIsPending(true);
    setError(null);

    const result =
      source.kind === "card"
        ? await depositToWishAction({
            wishId,
            expectedVersion,
            amount,
            idempotencyKey,
          })
        : await transferWishFundsAction({
            sourceWishId: source.wishId,
            destinationWishId: wishId,
            amount,
            sourceExpectedVersion: source.version,
            destinationExpectedVersion: expectedVersion,
            idempotencyKey,
          });

    setIsPending(false);

    if (!result.ok) {
      setError(result.message);
      setAttempt((count) => count + 1);
      return;
    }

    router.replace(
      `/wishes/${wishId}/deposit/done?amount=${amount}&from=${encodeURIComponent(source.kind === "card" ? "card" : source.wishId)}`,
    );
  };

  return (
    <div
      className="bg-pink-1 relative min-h-svh overflow-hidden"
      style={{
        backgroundImage: DOT_PATTERN,
        backgroundSize: "90.43px 109.91px",
        backgroundPosition: "0 -5px",
      }}
    >
      <CoinDrop key={attempt} onDrop={drop} />

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

      {error === null ? null : (
        <Toast message={error} tone="danger" onClose={() => setError(null)} />
      )}
    </div>
  );
}
