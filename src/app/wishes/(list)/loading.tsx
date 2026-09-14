import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";
import { ScreenHeader } from "../_components/screen-header";

export default function WishesLoading() {
  return (
    <div className="flex flex-col">
      <ScreenHeader title="진행중인 위시" backHref="/" />
      <SkeletonRegion
        label="위시 목록을 불러오는 중"
        className="flex flex-col gap-10 px-4 pb-10"
      >
        <Skeleton className="h-[172px]" />
        <Skeleton className="h-[172px]" />
      </SkeletonRegion>
    </div>
  );
}
