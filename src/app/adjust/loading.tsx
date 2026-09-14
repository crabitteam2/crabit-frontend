import { ScreenHeader } from "@/app/wishes/_components/screen-header";
import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";

export default function AdjustLoading() {
  return (
    <div className="flex flex-col">
      <ScreenHeader title="잔액 조정이 필요해요." backHref="/" />
      <SkeletonRegion
        label="잔액 조정 정보를 불러오는 중"
        className="flex flex-col px-4"
      >
        <Skeleton className="h-[212px]" />
        <Skeleton className="mt-[60px] h-[186px]" />
      </SkeletonRegion>
    </div>
  );
}
