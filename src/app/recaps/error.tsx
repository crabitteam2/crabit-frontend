"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function RecapsError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="리플레이"
      backHref="/"
      message="리플레이를 불러오지 못했어요"
      reset={reset}
    />
  );
}
