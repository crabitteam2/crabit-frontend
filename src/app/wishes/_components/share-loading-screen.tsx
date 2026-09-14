"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Toast } from "@/components/ui/toast";
import { shareWishAction, type WishActionResult } from "../wish-actions";
import { LoadingScreen } from "./loading-screen";
import { clearShareTicket, peekShareTicket } from "./share-ticket";

interface ShareLoadingScreenProps {
  wishId: string;
  expectedVersion: number;
  /** 글쓰기 화면이 끊은 표를 찾을 이름입니다. */
  ticketName: string;
  writeHref: string;
  doneHref: string;
}

/** 공유 요청을 보내고 결과가 올 때까지 로딩 연출을 보여줍니다. */
export function ShareLoadingScreen({
  wishId,
  expectedVersion,
  ticketName,
  writeHref,
  doneHref,
}: ShareLoadingScreenProps) {
  const router = useRouter();
  const startedRef = useRef(false);
  const [result, setResult] = useState<WishActionResult | null>(null);
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const visibility = peekShareTicket(ticketName);
    if (visibility === null) {
      router.replace(writeHref);
      return;
    }

    void shareWishAction(wishId, expectedVersion, visibility).then(setResult);
  }, [expectedVersion, router, ticketName, wishId, writeHref]);

  useEffect(() => {
    if (result === null || !isAnimationDone) return;

    if (result.ok) {
      clearShareTicket(ticketName);
      router.replace(doneHref);
      return;
    }

    if (result.code === "BALANCE_MISMATCH_LOCKED") {
      clearShareTicket(ticketName);
      router.replace("/adjust");
      return;
    }

    setError(result.message);
  }, [doneHref, isAnimationDone, result, router, ticketName]);

  return (
    <>
      <LoadingScreen
        label="학원 피드 공유 중"
        isComplete={result !== null}
        onFinish={() => setIsAnimationDone(true)}
      />
      {error === null ? null : (
        <Toast
          message={error}
          tone="danger"
          onClose={() => router.replace(writeHref)}
        />
      )}
    </>
  );
}
