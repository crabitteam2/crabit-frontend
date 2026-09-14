import { Skeleton, SkeletonRegion } from "@/components/ui/skeleton";
import { FeedSkeleton } from "./feed-skeleton";
import { FollowsSkeleton } from "./follows-skeleton";
import { ProfileSkeleton } from "./profile-skeleton";

function SearchSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-5">
        <Skeleton shape="control" className="h-12 flex-1" />
        <Skeleton shape="control" className="h-6 w-10" />
      </div>

      <SkeletonRegion
        label="학생 검색 화면을 불러오는 중"
        className="flex flex-col gap-3 px-4"
      >
        <Skeleton shape="control" className="h-7 w-24" />
        <Skeleton shape="control" className="h-10" />
      </SkeletonRegion>
    </div>
  );
}

/** 학원 피드의 화면마다 모양이 달라 들어온 주소에 맞는 스켈레톤을 고릅니다. */
export function SessionSkeleton({ pathname }: { pathname: string }) {
  if (pathname.endsWith("/follows")) return <FollowsSkeleton />;
  if (pathname === "/feed/search") return <SearchSkeleton />;
  if (pathname === "/feed") return <FeedSkeleton />;

  return (
    <ProfileSkeleton
      label={
        pathname === "/feed/me"
          ? "내 프로필을 불러오는 중"
          : "프로필을 불러오는 중"
      }
    />
  );
}
