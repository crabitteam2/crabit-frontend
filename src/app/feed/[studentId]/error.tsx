"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function StudentProfileError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="프로필"
      backHref="/feed"
      message="프로필을 불러오지 못했어요"
      reset={reset}
    />
  );
}
