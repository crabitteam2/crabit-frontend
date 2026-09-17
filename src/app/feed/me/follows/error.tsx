"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function MyFollowsError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      title="팔로우"
      backHref="/feed/me"
      message="목록을 불러오지 못했어요"
      reset={reset}
    />
  );
}
