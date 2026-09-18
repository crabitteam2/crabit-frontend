"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function FeedSearchError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="학생 검색"
      backHref="/feed"
      message="검색 화면을 불러오지 못했어요"
      reset={reset}
    />
  );
}
