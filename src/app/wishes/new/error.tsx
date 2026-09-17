"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function NewWishError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      backHref="/"
      message="화면을 불러오지 못했어요"
      reset={reset}
    />
  );
}
