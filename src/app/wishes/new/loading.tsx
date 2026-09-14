import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";
import { ScreenHeaderSkeleton } from "@/app/_components/screen-header-skeleton";

export default function NewWishLoading() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeaderSkeleton />

      <SkeletonRegion
        label="새 위시 등록 화면을 불러오는 중"
        className="flex flex-col gap-8 px-4"
      >
        <Skeleton shape="control" className="h-14" />
        <Skeleton shape="control" className="h-14" />
      </SkeletonRegion>
    </div>
  );
}
