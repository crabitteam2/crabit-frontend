"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ACADEMY_NAME } from "@/lib/mock/home";
import { TabBar } from "../_components/tab-bar";
import { HomeTabHeader } from "./_components/home-tab-header";

export default function HomeTabError({ reset }: { reset: () => void }) {
  const router = useRouter();

  return (
    <div className="bg-layer-basement flex min-h-[calc(100svh-env(safe-area-inset-bottom))] flex-col">
      <HomeTabHeader academyName={ACADEMY_NAME} />

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <p className="text-fg-neutral-muted text-center text-[20px] leading-7 font-medium tracking-[-0.3px]">
          카드 정보를 불러오지 못했어요
          <br />
          잠시 후 다시 시도해 주세요
        </p>
      </div>

      <div className="px-4 pb-[calc(96px+env(safe-area-inset-bottom))]">
        <Button
          size="xlarge"
          className="w-full"
          onClick={() => {
            router.refresh();
            reset();
          }}
        >
          다시 시도
        </Button>
      </div>
      <TabBar />
    </div>
  );
}
