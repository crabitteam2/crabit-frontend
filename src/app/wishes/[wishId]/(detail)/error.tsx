"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "../../_components/screen-header";

export default function WishDetailError({ reset }: { reset: () => void }) {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100svh-env(safe-area-inset-bottom))] flex-col">
      <ScreenHeader title="모은 돈 기록" backHref="/wishes" spacing="tight" />
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <p className="text-fg-neutral-muted text-center text-[20px] leading-7 font-medium tracking-[-0.3px]">
          위시를 불러오지 못했어요
          <br />
          잠시 후 다시 시도해 주세요
        </p>
      </div>
      <div className="px-4 pb-[calc(55px+env(safe-area-inset-bottom))]">
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
    </div>
  );
}
