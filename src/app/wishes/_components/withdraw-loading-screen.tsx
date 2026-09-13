"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Toast } from "@/components/ui/toast";
import {
  transferWishFundsAction,
  withdrawFromWishAction,
  type FundActionResult,
} from "../wish-actions";
import type { FundCounterpartRef } from "./fund-counterpart";
import { takeFundTicket } from "./fund-ticket";
import { LoadingScreen } from "./loading-screen";

interface WithdrawLoadingScreenProps {
  wishId: string;
  expectedVersion: number;
  destination: FundCounterpartRef;
  /** 금액 화면이 끊은 표를 찾을 이름입니다. */
  ticketName: string;
  amountHref: string;
  doneHref: string;
}

export function WithdrawLoadingScreen({
  wishId,
  expectedVersion,
  destination,
  ticketName,
  amountHref,
  doneHref,
}: WithdrawLoadingScreenProps) {
  const router = useRouter();
  const startedRef = useRef(false);
  const [result, setResult] = useState<FundActionResult | null>(null);
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const ticket = takeFundTicket(ticketName);
    if (ticket === null) {
      router.replace(amountHref);
      return;
    }

    const { amount, idempotencyKey } = ticket;
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
  }, [amountHref, destination, expectedVersion, router, ticketName, wishId]);

  useEffect(() => {
    if (result === null || !isAnimationDone) return;

    if (!result.ok && result.code === "BALANCE_MISMATCH_LOCKED") {
      router.replace("/adjust");
      return;
    }

    if (result.ok) {
      router.replace(
        `${doneHref}${doneHref.includes("?") ? "&" : "?"}event=${result.eventId}`,
      );
      return;
    }
    setError(result.message);
  }, [doneHref, isAnimationDone, result, router]);

  return (
    <>
      <LoadingScreen
        label="돈 꺼내는 중"
        isComplete={result !== null}
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
