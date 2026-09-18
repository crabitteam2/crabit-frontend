"use client";

import { ErrorScreen } from "@/app/_components/error-screen";
import { ACADEMY_NAME } from "@/lib/mock/home";
import { HomeTabHeader } from "./_components/home-tab-header";

export default function HomeTabError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      header={<HomeTabHeader academyName={ACADEMY_NAME} />}
      message="카드 정보를 불러오지 못했어요"
      reset={reset}
      hasTabBar
      className="bg-layer-basement"
    />
  );
}
