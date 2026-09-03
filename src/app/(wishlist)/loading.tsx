import { ACADEMY_NAME, NICKNAME } from "@/lib/mock/home";
import { AcademySection } from "../_components/academy-section";
import { CharacterArea } from "../_components/character-area";
import { HomeHeader } from "../_components/home-header";
import { RecapSection } from "../_components/recap-section";
import { TabBar } from "../_components/tab-bar";

export default function WishlistTabLoading() {
  return (
    <div className="flex flex-col">
      <CharacterArea stage={null}>
        <HomeHeader nickname={NICKNAME} wishPurpose={null} />
      </CharacterArea>

      <main className="relative -mt-[17px] flex flex-col px-4">
        <div
          role="status"
          aria-label="위시리스트를 불러오는 중"
          className="flex flex-col"
        >
          <div className="bg-gray-1 h-[52px] animate-pulse rounded-[20px]" />
          <div className="bg-gray-1 mt-10 h-[152px] animate-pulse rounded-[20px]" />
        </div>
        <div className="pt-[68px]">
          <AcademySection academyName={ACADEMY_NAME} />
        </div>
        <div className="pt-[68px]">
          <RecapSection />
        </div>
      </main>

      <div className="h-[182px]" />
      <TabBar />
    </div>
  );
}
