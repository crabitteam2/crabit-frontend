"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserApiClient } from "@/lib/http/browser";
import { listAcademyStudentFollowing } from "@/lib/http/follows";
import type { CrabitApiClient } from "@/lib/http/follows";
import type { components } from "@/lib/http/generated/crabit-backend";
import { behaviorRead, useBehaviorSession } from "./behavior-session";
import {
  toStudentProfileItem,
  type StudentFollowCounts,
  type StudentProfileItem,
} from "./feed-item";
import { findMyStudentBlock } from "./student-blocks";
import { StudentProfile } from "./student-profile";

const CARD_PAGE_LIMIT = 100;

const COUNT_PAGE_LIMIT = 1;

const EMPTY_COUNTS: StudentFollowCounts = {
  followingCount: 0,
  followerCount: 0,
};

type Student = components["schemas"]["StudentRelationship"];
type SharedCardPage = components["schemas"]["SharedCardPage"];

interface StudentProfileScreenProps {
  studentId: string;
}

interface ProfileView {
  readonly profile: StudentProfileItem;
  readonly isBlocked: boolean;
}

export function StudentProfileScreen({ studentId }: StudentProfileScreenProps) {
  const session = useBehaviorSession();
  const client = useMemo(() => createBrowserApiClient(), []);
  const [view, setView] = useState<ProfileView | null>(null);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (session === null) return;

    let isActive = true;
    const { context, entry } = session;
    setView(null);
    setHasError(false);

    const load = async () => {
      const student = await behaviorRead<Student>(
        context,
        `students/${encodeURIComponent(studentId)}`,
      );
      if (student.studentId !== studentId) throw new Error("Target mismatch");
      if (!entry.submitted) {
        entry.submitted = true;
        entry.queue.offer("profile-visits", {
          eventId: entry.eventId,
          occurredAt: entry.occurredAt,
          targetStudentId: studentId,
        });
      }

      const cards = await behaviorRead<SharedCardPage>(
        context,
        `shared-cards?ownerId=${encodeURIComponent(studentId)}&limit=${CARD_PAGE_LIMIT}`,
      );
      const counts = await readFollowCounts(
        client,
        context.academyId,
        studentId,
      );
      if (isActive) {
        setView({
          profile: toStudentProfileItem(student, cards.items, counts),
          isBlocked: false,
        });
      }
    };

    // 내가 차단한 학생은 프로필 조회가 404라 차단 목록으로 화면을 결정한다.
    const loadBlocked = async () => {
      const block = await findMyStudentBlock(client, studentId);
      if (!isActive) return;
      if (block === null) {
        setHasError(true);
        return;
      }

      setView({
        profile: toBlockedProfile(studentId, block.nickname),
        isBlocked: true,
      });
    };

    void load().catch(() =>
      loadBlocked().catch(() => {
        if (isActive) setHasError(true);
      }),
    );

    return () => {
      isActive = false;
    };
  }, [client, studentId, session, reloadKey]);

  if (hasError) {
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

  if (view === null || session === null) return null;

  return (
    <StudentProfile
      academyId={session.context.academyId}
      profile={view.profile}
      isBlocked={view.isBlocked}
      onUnblocked={() => setReloadKey((key) => key + 1)}
    />
  );
}

async function readFollowCounts(
  client: CrabitApiClient,
  academyId: string,
  studentId: string,
): Promise<StudentFollowCounts> {
  const result = await listAcademyStudentFollowing(client, {
    academyId,
    studentId,
    limit: COUNT_PAGE_LIMIT,
  });

  return result.ok
    ? {
        followingCount: result.data.followingCount,
        followerCount: result.data.followerCount,
      }
    : EMPTY_COUNTS;
}

function toBlockedProfile(
  studentId: string,
  nickname: string,
): StudentProfileItem {
  return {
    id: studentId,
    nickname,
    inProgress: [],
    finished: [],
    ...EMPTY_COUNTS,
    isFollowing: false,
  };
}
