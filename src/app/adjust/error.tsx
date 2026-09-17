"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function AdjustError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="어떤 위시에서 꺼낼까요?"
      backHref="/"
      message="잔액 정보를 불러오지 못했어요"
      reset={reset}
    />
  );
}
