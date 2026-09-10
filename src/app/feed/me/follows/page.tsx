import { loadAccountContext } from "@/app/wishes/load-account";
import { listAcademyFollowers, listAcademyFollowing } from "@/lib/http/follows";
import {
  FollowListScreen,
  type FollowTab,
} from "../../_components/follow-list-screen";

const PAGE_LIMIT = 100;

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

  const { client, account } = await loadAccountContext();
  const result =
    tab === "followers"
      ? await listAcademyFollowers(client, {
          academyId: account.academyId,
          limit: PAGE_LIMIT,
        })
      : await listAcademyFollowing(client, {
          academyId: account.academyId,
          limit: PAGE_LIMIT,
        });

  return (
    <FollowListScreen
      backHref="/feed/me"
      tab={tab}
      followingHref="/feed/me/follows"
      followersHref="/feed/me/follows?tab=followers"
      academyId={account.academyId}
      {...(result.ok
        ? { initialPage: result.data }
        : { initialError: "failed" as const })}
    />
  );
}
