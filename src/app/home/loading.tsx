import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";
import { ACADEMY_NAME } from "@/lib/mock/home";
import { HomeTabHeader } from "./_components/home-tab-header";

export default function HomeTabLoading() {
  return (
    <div className="bg-layer-basement flex min-h-dvh flex-col">
      <HomeTabHeader academyName={ACADEMY_NAME} />

      <SkeletonRegion
        label="홈 정보를 불러오는 중"
        className="flex flex-col gap-5 px-4"
      >
        <Skeleton className="h-[212px]" />
        <Skeleton shape="control" className="h-[68px]" />
        <Skeleton className="h-[104px]" />
      </SkeletonRegion>

      <div className="h-[182px]" />
    </div>
  );
}
