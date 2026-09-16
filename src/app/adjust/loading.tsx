import { ScreenHeader } from "@/app/wishes/_components/screen-header";
import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";

export default function AdjustLoading() {
  return (
    <div className="flex flex-col">
      <ScreenHeader title="어떤 위시에서 꺼낼까요?" backHref="/" />
      <SkeletonRegion
        label="잔액 조정 정보를 불러오는 중"
        className="flex flex-col px-4"
      >
        <Skeleton className="h-[76px]" />
        <Skeleton className="mt-10 h-[269px]" />
      </SkeletonRegion>
    </div>
  );
}
