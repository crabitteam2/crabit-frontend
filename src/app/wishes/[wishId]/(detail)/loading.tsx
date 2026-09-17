import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";
import { ScreenHeader } from "../../_components/screen-header";

export default function WishDetailLoading() {
  return (
    <div className="flex flex-col">
      <ScreenHeader title="모은 돈 기록" backHref="/wishes" />
      <SkeletonRegion
        label="위시를 불러오는 중"
        className="flex flex-col gap-6 px-4"
      >
        <Skeleton className="h-[232px]" />
        <Skeleton shape="control" className="h-12" />
      </SkeletonRegion>
    </div>
  );
}
