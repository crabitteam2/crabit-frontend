"use client";

import { useParams } from "next/navigation";
import { ErrorScreen } from "@/app/_components/error-screen";

export default function StudentFollowsError({ reset }: { reset: () => void }) {
  const params = useParams<{ studentId: string }>();

  return (
    <ErrorScreen
      title="팔로우"
      backHref={`/feed/${params.studentId}`}
      message="목록을 불러오지 못했어요"
      reset={reset}
    />
  );
}
