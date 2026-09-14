import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";
import { ScreenHeaderSkeleton } from "@/app/_components/screen-header-skeleton";

export default function AdjustFlowLoading() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeaderSkeleton />

      <SkeletonRegion
        label="잔액 조정 화면을 불러오는 중"
        className="flex flex-col gap-6 px-4"
      >
        <Skeleton className="h-[212px]" />
        <Skeleton shape="control" className="h-12" />
      </SkeletonRegion>
    </div>
  );
}
