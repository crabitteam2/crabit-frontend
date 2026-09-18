"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function DepositDoneError() {
  return <ErrorScreen backHref="/" message="기록을 불러오지 못했어요" />;
}
