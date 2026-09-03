import { toProgressPercent } from "@/app/_components/progress-stage";
import { homeCard } from "@/lib/mock/home";
import { resolveWishListData, type Wish } from "@/lib/mock/wishes";
import { ProfileScreen } from "../_components/profile-screen";
import type { ProfileWishItem } from "../_components/feed-item";

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
      inProgress={inProgress.map(toProfileWishItem)}
      finished={finished.map(toProfileWishItem)}
      backHref="/feed"
      followingCount={MY_FOLLOWING_COUNT}
      followerCount={MY_FOLLOWER_COUNT}
      followsHref="/feed/me/follows"
    />
  );
}

function toProfileWishItem(wish: Wish): ProfileWishItem {
  return {
    id: wish.id,
    purpose: wish.purpose,
    percent: toProgressPercent(wish.amount, wish.targetAmount),
    state: wish.state,
    startDate: wish.startDate === "" ? null : `20${wish.startDate}`,
    targetDate: wish.targetDate === "" ? null : `20${wish.targetDate}`,
    ...(wish.imageUrl === undefined ? {} : { imageUrl: wish.imageUrl }),
  };
}
