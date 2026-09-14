import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";
import { ScreenHeaderSkeleton } from "../_components/screen-header-skeleton";

export default function RecapsLoading() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeaderSkeleton />

      <SkeletonRegion
        label="리캡을 불러오는 중"
        className="flex flex-col gap-6 px-4 pb-10"
      >
        <Skeleton shape="control" className="h-11" />
        <Skeleton className="h-[420px]" />
      </SkeletonRegion>
    </div>
  );
}
