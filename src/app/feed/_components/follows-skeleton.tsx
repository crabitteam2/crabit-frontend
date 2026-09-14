import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";

/** 팔로잉과 팔로워 목록이 조회를 기다리는 동안 같은 자리에 그리는 화면입니다. */
export function FollowsSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="border-gray-3 flex items-center border-b px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
        <Skeleton shape="circle" className="size-8" />
        <div className="flex flex-1 items-center justify-center gap-6">
          <Skeleton shape="control" className="h-6 w-16" />
          <Skeleton shape="control" className="h-6 w-16" />
        </div>
        <span aria-hidden="true" className="size-8 shrink-0" />
      </div>

      <div className="px-4 py-4">
        <Skeleton shape="control" className="h-12" />
      </div>

      <SkeletonRegion
        label="팔로우 목록을 불러오는 중"
        className="flex flex-col gap-3 px-4"
      >
        <Skeleton shape="control" className="h-10" />
        <Skeleton shape="control" className="h-10" />
        <Skeleton shape="control" className="h-10" />
      </SkeletonRegion>
    </div>
  );
}
