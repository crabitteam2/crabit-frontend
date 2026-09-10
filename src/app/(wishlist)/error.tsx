"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NICKNAME } from "@/lib/mock/home";
import { CharacterArea } from "../_components/character-area";
import { HomeHeader } from "../_components/home-header";
import { TabBar } from "../_components/tab-bar";

export default function WishlistTabError({ reset }: { reset: () => void }) {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100svh-env(safe-area-inset-bottom))] flex-col">
      <CharacterArea stage={null}>
        <HomeHeader nickname={NICKNAME} wishPurpose={null} />
      </CharacterArea>

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <p className="text-fg-neutral-muted text-center text-[20px] leading-7 font-medium tracking-[-0.3px]">
          위시리스트를 불러오지 못했어요
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
      <TabBar />
    </div>
  );
}
