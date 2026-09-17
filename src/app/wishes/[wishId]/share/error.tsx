"use client";

import { useParams } from "next/navigation";
import { ErrorScreen } from "@/app/_components/error-screen";

export default function WishShareError({ reset }: { reset: () => void }) {
  const params = useParams<{ wishId: string }>();

  return (
    <ErrorScreen
      backHref={`/wishes/${params.wishId}`}
      message="화면을 불러오지 못했어요"
      reset={reset}
    />
  );
}
