"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function FeedError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="학원 피드"
      backHref="/"
      message="피드를 불러오지 못했어요"
      reset={reset}
    />
  );
}
