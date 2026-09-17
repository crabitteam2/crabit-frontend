"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  transferWishFundsAction,
  withdrawFromWishAction,
  type FundActionResult,
} from "../wish-actions";
import type { FundCounterpartRef } from "./fund-counterpart";
import { FundErrorScreen } from "./fund-error-screen";
import { clearFundTicket, peekFundTicket, putFundTicket } from "./fund-ticket";
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

    // 표를 남겨두어 새로고침해도 같은 요청으로 결과를 다시 받아온다.
    const ticket = peekFundTicket(ticketName);
    if (ticket === null) {
      router.replace(amountHref);
      return;
    }

    const { amount, idempotencyKey } = ticket;
    // 처음 보낼 때 쓴 버전을 남겨, 새로고침해도 같은 요청이 되게 한다.
    const sourceVersion = ticket.sourceVersion ?? expectedVersion;
    const destinationVersion =
      ticket.destinationVersion ??
      (destination.kind === "card" ? undefined : destination.version);
    if (ticket.sourceVersion === undefined) {
      putFundTicket(ticketName, {
        ...ticket,
        sourceVersion,
        destinationVersion,
      });
    }

    const run =
      destination.kind === "card"
        ? withdrawFromWishAction({
            wishId,
            expectedVersion: sourceVersion,
            amount,
            idempotencyKey,
          })
        : transferWishFundsAction({
            sourceWishId: wishId,
            destinationWishId: destination.wishId,
            amount,
            sourceExpectedVersion: sourceVersion,
            destinationExpectedVersion:
              destinationVersion ?? destination.version,
            idempotencyKey,
          });

    void run.then(setResult);
  }, [amountHref, destination, expectedVersion, router, ticketName, wishId]);

  useEffect(() => {
    if (result === null || !isAnimationDone) return;

    // 결과가 나왔으면 표를 쓸 일이 없다.
    clearFundTicket(ticketName);

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
  }, [doneHref, isAnimationDone, result, router, ticketName]);

  if (error !== null) {
    return (
      <FundErrorScreen
        action="돈 꺼내기"
        reason={error}
        exit={{ href: `/wishes/${wishId}`, label: "위시로 돌아가기" }}
      />
    );
  }

  return (
    <LoadingScreen
      label="돈 꺼내는 중"
      isComplete={result !== null}
      onFinish={() => setIsAnimationDone(true)}
    />
  );
}
