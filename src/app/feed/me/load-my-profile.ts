import "server-only";
import { loadAccountContext } from "@/app/wishes/load-account";
import { listAllWishes } from "@/app/wishes/list-all-wishes";
import { listAcademyFollowing } from "@/lib/http/follows";
import { unwrapResult } from "@/lib/http/result";
import { readPersonaDisplayName } from "@/lib/persona/display-name-server";
import { toOwnedProfileWishes } from "./owned-profile-wishes";

/** 선택된 요청으로 인증한 내 계좌에서 프로필을 구성합니다. 학생 ID를 추측하지 않습니다. */
export async function loadMyProfile() {
  const { client, account, cardBalanceAccountId } = await loadAccountContext();
  const [wishes, follows, nickname] = await Promise.all([
    listAllWishes(client, cardBalanceAccountId),
    listAcademyFollowing(client, { academyId: account.academyId, limit: 1 }),
    readPersonaDisplayName(),
  ]);
  const counts = unwrapResult(follows);
  return {
    nickname,
    ...toOwnedProfileWishes(wishes),
    followingCount: counts.followingCount,
    followerCount: counts.followerCount,
  };
}
