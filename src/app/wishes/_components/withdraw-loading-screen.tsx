"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Toast } from "@/components/ui/toast";
import {
  transferWishFundsAction,
  withdrawFromWishAction,
  type WishActionResult,
} from "../wish-actions";
import type { FundCounterpartRef } from "./fund-counterpart";
import { LoadingScreen } from "./loading-screen";

interface WithdrawLoadingScreenProps {
  wishId: string;
  amount: number;
  expectedVersion: number;
  destination: FundCounterpartRef;
  amountHref: string;
  doneHref: string;
}

export function WithdrawLoadingScreen({
  wishId,
  amount,
  expectedVersion,
  destination,
  amountHref,
  doneHref,
}: WithdrawLoadingScreenProps) {
  const router = useRouter();
  const startedRef = useRef(false);
  const [result, setResult] = useState<WishActionResult | null>(null);
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const idempotencyKey = crypto.randomUUID();
    const run =
      destination.kind === "card"
        ? withdrawFromWishAction({
            wishId,
            expectedVersion,
            amount,
            idempotencyKey,
          })
        : transferWishFundsAction({
            sourceWishId: wishId,
            destinationWishId: destination.wishId,
            amount,
            sourceExpectedVersion: expectedVersion,
            destinationExpectedVersion: destination.version,
            idempotencyKey,
          });

    void run.then(setResult);
  }, [amount, destination, expectedVersion, wishId]);

  useEffect(() => {
    if (result === null || !isAnimationDone) return;

    if (result.ok) {
      router.replace(doneHref);
      return;
    }
    setError(result.message);
  }, [doneHref, isAnimationDone, result, router]);

  return (
    <>
      <LoadingScreen
        label="돈 꺼내는 중"
        onFinish={() => setIsAnimationDone(true)}
      />
      {error === null ? null : (
        <Toast
          message={error}
          tone="danger"
          onClose={() => router.replace(amountHref)}
        />
      )}
    </>
  );
}
