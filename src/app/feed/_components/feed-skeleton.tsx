import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";
import { ACADEMY_NAME } from "@/lib/mock/home";
import { FeedHeader } from "./feed-header";

function FeedCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <Skeleton shape="control" className="h-6 w-40" />
        <Skeleton shape="control" className="h-10 w-20" />
      </div>
      <div className="bg-pink-1 flex flex-col items-center gap-5 px-4 pt-3 pb-6">
        <Skeleton shape="circle" className="size-[232px]" />
        <Skeleton shape="control" className="h-7 w-40" />
        <Skeleton shape="control" className="h-4 w-full" />
      </div>
    </div>
  );
}

/** 학원 피드가 조회를 기다리는 동안 같은 자리에 그리는 화면입니다. */
export function FeedSkeleton() {
  return (
    <div className="flex flex-col">
      <FeedHeader academyName={ACADEMY_NAME} backHref="/" sortLabel="추천순" />

      <SkeletonRegion
        label="학원 피드를 불러오는 중"
        className="flex flex-col pb-10"
      >
        <FeedCardSkeleton />
        <FeedCardSkeleton />
      </SkeletonRegion>
    </div>
  );
}
