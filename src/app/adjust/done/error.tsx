"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function AdjustDoneError() {
  return <ErrorScreen backHref="/" message="잔액 정보를 불러오지 못했어요" />;
}
