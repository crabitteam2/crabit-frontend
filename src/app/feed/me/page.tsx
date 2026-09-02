import { homeCard } from "@/lib/mock/home";
import { resolveWishListData } from "@/lib/mock/wishes";
import { ProfileScreen } from "../_components/profile-screen";

const MY_FOLLOWING_COUNT = 8;

const MY_FOLLOWER_COUNT = 15;

export default async function MyProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const { inProgress, finished } = resolveWishListData(query);

  return (
    <ProfileScreen
      nickname={homeCard.ownerName}
      inProgress={inProgress}
      finished={finished}
      backHref="/feed"
      followingCount={MY_FOLLOWING_COUNT}
      followerCount={MY_FOLLOWER_COUNT}
      followsHref="/feed/me/follows"
    />
  );
}
