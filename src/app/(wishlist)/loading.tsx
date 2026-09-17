import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";
import { ACADEMY_NAME, NICKNAME } from "@/lib/mock/home";
import { AcademySection } from "../_components/academy-section";
import { CharacterArea } from "../_components/character-area";
import { HomeHeader } from "../_components/home-header";

export default function WishlistTabLoading() {
  return (
    <div className="flex flex-col">
      <CharacterArea stage={null}>
        <HomeHeader nickname={NICKNAME} wishPurpose={null} />
      </CharacterArea>

      <main className="relative -mt-[17px] flex flex-col px-4">
        <SkeletonRegion
          label="위시리스트를 불러오는 중"
          className="flex flex-col"
        >
          <Skeleton className="h-[52px]" />
          <Skeleton className="mt-10 h-[152px]" />
        </SkeletonRegion>
        <div className="pt-[68px]">
          <AcademySection academyName={ACADEMY_NAME} />
        </div>
        <div className="pt-[68px]">
          <section aria-labelledby="recap-loading-heading">
            <h2
              id="recap-loading-heading"
              className="text-t1 text-fg-neutral font-bold"
            >
              리플레이: 저축 리포트
            </h2>
            <SkeletonRegion
              label="리플레이를 불러오는 중"
              className="no-scrollbar -mx-4 mt-2 flex gap-4 overflow-x-auto px-4 pb-1"
            >
              <Skeleton className="h-[300px] w-60 shrink-0" />
              <Skeleton className="h-[300px] w-60 shrink-0" />
            </SkeletonRegion>
          </section>
        </div>
      </main>

      <div className="h-[182px]" />
    </div>
  );
}
