import Image from "next/image";
import heroImage from "@/../public/images/feed/profile-hero.png";
import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";

/** 프로필이 조회를 기다리는 동안 같은 자리에 그리는 화면입니다. */
export function ProfileSkeleton({ label }: { label: string }) {
  return (
    <div className="flex flex-col">
      <div className="relative h-[348px] w-full overflow-hidden bg-gradient-to-b from-[#fcb1d6] to-[#f8f8f8]">
        <Image
          src={heroImage}
          alt=""
          width={320}
          height={320}
          priority
          className="absolute top-[73px] left-1/2 size-[320px] -translate-x-1/2 object-cover"
        />
      </div>

      <SkeletonRegion label={label} className="flex flex-col">
        <div className="border-gray-3 flex items-center border-b px-4 py-3">
          <Skeleton shape="control" className="h-7 w-28" />
        </div>
        <div className="border-gray-3 flex items-center justify-between border-b px-4 py-5">
          <Skeleton shape="control" className="h-12 w-14" />
          <Skeleton shape="control" className="h-12 w-14" />
          <Skeleton shape="control" className="h-12 w-14" />
          <Skeleton shape="control" className="h-12 w-14" />
        </div>
        <div className="flex flex-col gap-4 px-4 pt-6">
          <Skeleton shape="control" className="h-8 w-40" />
          <Skeleton className="h-[186px]" />
          <Skeleton className="h-[186px]" />
        </div>
      </SkeletonRegion>
    </div>
  );
}
