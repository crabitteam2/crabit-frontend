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
  const tab: FollowTab =
    raw === "followers" ? "followers" : "following";
  const academyId = firstQueryValue(query.academyId);
  const base = `/feed/${encodeURIComponent(studentId)}/follows`;
  const academyQuery = academyId === undefined
    ? ""
    : `?academyId=${encodeURIComponent(academyId)}`;

  if (academyId === undefined) {
    return (
      <FollowListScreen
        backHref={`/feed/${encodeURIComponent(studentId)}`}
        tab={tab}
        followingHref={`${base}${academyQuery}`}
        followersHref={`${base}${academyQuery}&tab=followers`}
        academyId=""
        ownerStudentId={studentId}
        initialError="unavailable"
      />
    );
  }

  const client = createServerApiClient({ request: { headers: await headers() } });
  const result = tab === "followers"
    ? await listAcademyStudentFollowers(client, { academyId, studentId })
    : await listAcademyStudentFollowing(client, { academyId, studentId });

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
      followingHref={`${base}${academyQuery}`}
      followersHref={`${base}${academyQuery}&tab=followers`}
      academyId={academyId}
      ownerStudentId={studentId}
      {...(result.ok ? { initialPage: result.data } : { initialError })}
    />
  );
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
