"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function WishInfoDoneError() {
  return <ErrorScreen backHref="/" message="위시 정보를 불러오지 못했어요" />;
}
