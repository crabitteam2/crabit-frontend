"use client";

import { ErrorScreen } from "@/app/_components/error-screen";

export default function NewWishDoneError() {
  return <ErrorScreen backHref="/" message="위시를 불러오지 못했어요" />;
}
