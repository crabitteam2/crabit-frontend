import { loadAccountContext } from "@/app/wishes/load-account";
import { getAcademyStudent, listAcademyFollowing } from "@/lib/http/follows";
import { listAcademySharedCards } from "@/lib/http/shared-cards";
import { MY_STUDENT_ID } from "@/lib/mock/me";
import { toStudentProfileItem } from "../_components/feed-item";
import { ProfileScreen } from "../_components/profile-screen";

const CARD_PAGE_LIMIT = 100;

const COUNT_PAGE_LIMIT = 1;

export default async function MyProfilePage() {
  const { client, account } = await loadAccountContext();
  const academyId = account.academyId;
  const [studentResult, cardsResult, followsResult] = await Promise.all([
    getAcademyStudent(client, { academyId, studentId: MY_STUDENT_ID }),
    listAcademySharedCards(client, {
      academyId,
      ownerId: MY_STUDENT_ID,
      limit: CARD_PAGE_LIMIT,
    }),
    listAcademyFollowing(client, { academyId, limit: COUNT_PAGE_LIMIT }),
  ]);

  if (!studentResult.ok || !cardsResult.ok) {
    return (
      <p
        role="alert"
        className="text-fg-neutral-muted px-4 py-10 text-center text-[20px] leading-7 font-medium tracking-[-0.3px]"
      >
        프로필을 불러오지 못했어요
        <br />
        잠시 후 다시 시도해 주세요
      </p>
    );
  }

  const profile = toStudentProfileItem(
    studentResult.data,
    cardsResult.data.items,
    followsResult.ok
      ? {
          followingCount: followsResult.data.followingCount,
          followerCount: followsResult.data.followerCount,
        }
      : { followingCount: 0, followerCount: 0 },
  );

  return (
    <ProfileScreen
      nickname={profile.nickname}
      inProgress={profile.inProgress}
      finished={profile.finished}
      backHref="/feed"
      followingCount={profile.followingCount}
      followerCount={profile.followerCount}
      followsHref="/feed/me/follows"
    />
  );
}
