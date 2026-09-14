import { Skeleton } from "@/components/ui/skeleton";

/** 제목이 정해지기 전의 화면이 기다리는 동안 헤더 자리를 지킵니다. */
export function ScreenHeaderSkeleton() {
  return (
    <div className="flex items-center gap-1 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
      <Skeleton shape="circle" className="size-8" />
      <Skeleton shape="control" className="h-7 w-40" />
    </div>
  );
}
