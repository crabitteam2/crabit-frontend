import { headers } from "next/headers";
import {
  listAcademyStudentFollowers,
  listAcademyStudentFollowing,
} from "@/lib/http/follows";
import { createServerApiClient } from "@/lib/http/server";
import {
  FollowListScreen,
  type FollowTab,
} from "../../_components/follow-list-screen";

const PAGE_LIMIT = 100;

export default async function StudentFollowsPage({
  params,
  searchParams,
}: {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { studentId } = await params;
  const query = await searchParams;
  const raw = firstQueryValue(query.tab);
  const tab: FollowTab = raw === "followers" ? "followers" : "following";
  const academyId = firstQueryValue(query.academyId);
  const base = `/feed/${encodeURIComponent(studentId)}/follows`;
  const academyQuery =
    academyId === undefined
      ? ""
      : `?academyId=${encodeURIComponent(academyId)}`;
  const followingHref = `${base}${academyQuery}`;
  const followersHref = withSearchParameter(followingHref, "tab", "followers");

  if (academyId === undefined) {
    return (
      <FollowListScreen
        backHref={`/feed/${encodeURIComponent(studentId)}`}
        tab={tab}
        followingHref={followingHref}
        followersHref={followersHref}
        academyId=""
        ownerStudentId={studentId}
        initialError="unavailable"
      />
    );
  }

  const client = createServerApiClient({
    request: { headers: await headers() },
  });
  const result =
    tab === "followers"
      ? await listAcademyStudentFollowers(client, {
          academyId,
          studentId,
          limit: PAGE_LIMIT,
        })
      : await listAcademyStudentFollowing(client, {
          academyId,
          studentId,
          limit: PAGE_LIMIT,
        });

  const initialError = result.ok
    ? undefined
    : result.error.status === 404
      ? "unavailable"
      : "failed";

  return (
    <FollowListScreen
      key={`${academyId}:${studentId}:${tab}`}
      backHref={`/feed/${encodeURIComponent(studentId)}${academyQuery}`}
      tab={tab}
      followingHref={followingHref}
      followersHref={followersHref}
      academyId={academyId}
      ownerStudentId={studentId}
      {...(result.ok ? { initialPage: result.data } : { initialError })}
    />
  );
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function withSearchParameter(href: string, key: string, value: string) {
  const [path, fragment] = href.split("#", 2);
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}${
    fragment === undefined ? "" : `#${fragment}`
  }`;
}
