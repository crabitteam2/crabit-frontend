"use client";

import { ErrorScreen } from "@/app/_components/error-screen";
import { NICKNAME } from "@/lib/mock/home";
import { CharacterArea } from "../_components/character-area";
import { HomeHeader } from "../_components/home-header";

export default function WishlistTabError({ reset }: { reset: () => void }) {
  return (
    <ErrorScreen
      header={
        <CharacterArea stage={null}>
          <HomeHeader nickname={NICKNAME} wishPurpose={null} />
        </CharacterArea>
      }
      message="위시리스트를 불러오지 못했어요"
      reset={reset}
      hasTabBar
    />
  );
}
