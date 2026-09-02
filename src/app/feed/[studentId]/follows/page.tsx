import { notFound } from "next/navigation";
import {
  FOLLOWER_ENTRIES,
  FOLLOWING_ENTRIES,
  findStudentProfile,
} from "@/lib/mock/feed";
import {
  FollowListScreen,
  type FollowTab,
} from "../../_components/follow-list-screen";

export default async function StudentFollowsPage({
  params,
  searchParams,
}: {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { studentId } = await params;
  if (findStudentProfile(studentId) === null) notFound();

  const query = await searchParams;
  const raw = query.tab;
  const tab: FollowTab =
    (Array.isArray(raw) ? raw[0] : raw) === "followers"
      ? "followers"
      : "following";

  const base = `/feed/${studentId}/follows`;

  return (
    <FollowListScreen
      backHref={`/feed/${studentId}`}
      tab={tab}
      followingHref={base}
      followersHref={`${base}?tab=followers`}
      following={FOLLOWING_ENTRIES}
      followers={FOLLOWER_ENTRIES}
    />
  );
}
