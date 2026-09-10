"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "./screen-header";

interface FundFlowErrorProps {
  title: string;
  reset: () => void;
}

export function FundFlowError({ title, reset }: FundFlowErrorProps) {
  const router = useRouter();
  const params = useParams<{ wishId: string }>();

  return (
    <div className="flex min-h-[calc(100svh-env(safe-area-inset-bottom))] flex-col">
      <ScreenHeader title={title} backHref={`/wishes/${params.wishId}`} />
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <p className="text-fg-neutral-muted text-center text-[20px] leading-7 font-medium tracking-[-0.3px]">
          화면을 불러오지 못했어요
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
