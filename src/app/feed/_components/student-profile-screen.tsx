"use client";

import { useEffect, useState } from "react";
import type { components } from "@/lib/http/generated/crabit-backend";
import { behaviorRead, useBehaviorSession } from "./behavior-session";
import { toStudentProfileItem, type StudentProfileItem } from "./feed-item";
import { StudentProfile } from "./student-profile";

const CARD_PAGE_LIMIT = 100;

type Student = components["schemas"]["StudentRelationship"];
type SharedCardPage = components["schemas"]["SharedCardPage"];

interface StudentProfileScreenProps {
  studentId: string;
}

export function StudentProfileScreen({ studentId }: StudentProfileScreenProps) {
  const session = useBehaviorSession();
  const [profile, setProfile] = useState<StudentProfileItem | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (session === null) return;

    let isActive = true;
    const { context, entry } = session;
    setProfile(null);
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
      if (isActive) setProfile(toStudentProfileItem(student, cards.items));
    };

    void load().catch(() => {
      if (isActive) setHasError(true);
    });

    return () => {
      isActive = false;
    };
  }, [studentId, session]);

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

  if (profile === null) return null;

  return <StudentProfile profile={profile} />;
}
