import { loadAccountContext } from "@/app/wishes/load-account";
import { listAcademyFollowing } from "@/lib/http/follows";
import { listAcademySharedCards } from "@/lib/http/shared-cards";
import { MY_NAME } from "@/lib/mock/home";
import { MY_STUDENT_ID } from "@/lib/mock/me";
import { toProfileWishes } from "../_components/feed-item";
import { ProfileScreen } from "../_components/profile-screen";

const CARD_PAGE_LIMIT = 100;

const COUNT_PAGE_LIMIT = 1;

export default async function MyProfilePage() {
  const { client, account } = await loadAccountContext();
  const academyId = account.academyId;
  const [cardsResult, followsResult] = await Promise.all([
    listAcademySharedCards(client, {
      academyId,
      ownerId: MY_STUDENT_ID,
      limit: CARD_PAGE_LIMIT,
    }),
    listAcademyFollowing(client, { academyId, limit: COUNT_PAGE_LIMIT }),
  ]);

  if (!cardsResult.ok) {
    throw new Error("Failed to load my profile cards");
  }

  const { inProgress, finished } = toProfileWishes(cardsResult.data.items);

  return (
    <ProfileScreen
      nickname={MY_NAME}
      inProgress={inProgress}
      finished={finished}
      backHref="/feed"
      followingCount={followsResult.ok ? followsResult.data.followingCount : 0}
      followerCount={followsResult.ok ? followsResult.data.followerCount : 0}
      followsHref="/feed/me/follows"
    />
  );
}
