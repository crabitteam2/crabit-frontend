import { FOLLOWER_ENTRIES, FOLLOWING_ENTRIES } from "@/lib/mock/feed";
import {
  FollowListScreen,
  type FollowTab,
} from "../../_components/follow-list-screen";

export default async function MyFollowsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const raw = query.tab;
  const tab: FollowTab =
    (Array.isArray(raw) ? raw[0] : raw) === "followers"
      ? "followers"
      : "following";

  return (
    <FollowListScreen
      backHref="/feed/me"
      tab={tab}
      followingHref="/feed/me/follows"
      followersHref="/feed/me/follows?tab=followers"
      following={FOLLOWING_ENTRIES}
      followers={FOLLOWER_ENTRIES}
    />
  );
}
