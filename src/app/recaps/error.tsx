"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RecapError({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-8 px-4">
      <p className="text-fg-neutral-muted text-center text-[20px] leading-7 font-medium">
        리플레이를 불러오지 못했어요
        <br />
        잠시 후 다시 시도해 주세요
      </p>
      <Button
        size="xlarge"
        className="w-full max-w-sm"
        onClick={() => {
          router.refresh();
          reset();
        }}
      >
        다시 시도
      </Button>
    </main>
  );
}
