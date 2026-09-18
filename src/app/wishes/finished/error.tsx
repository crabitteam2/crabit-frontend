"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function FinishedWishesError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="종료된 위시"
      backHref="/wishes"
      message="위시를 불러오지 못했어요"
      reset={reset}
    />
  );
}
