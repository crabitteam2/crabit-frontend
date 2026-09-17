"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function WishDetailError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="모은 돈 기록"
      backHref="/wishes"
      message="위시를 불러오지 못했어요"
      reset={reset}
    />
  );
}
