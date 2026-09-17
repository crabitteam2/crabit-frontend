"use client";

import { useParams } from "next/navigation";
import { ErrorScreen } from "@/app/_components/error-screen";

export default function WishInfoError({ reset }: { reset: () => void }) {
  const params = useParams<{ wishId: string }>();

  return (
    <ErrorScreen
      title="위시 정보"
      backHref={`/wishes/${params.wishId}`}
      message="위시 정보를 불러오지 못했어요"
      reset={reset}
    />
  );
}
