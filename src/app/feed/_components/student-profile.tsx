"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import moreIcon from "@/../public/images/feed/more.svg";
import searchIcon from "@/../public/images/feed/search.svg";
import { Toast } from "@/components/ui/toast";
import {
  toggleProfileBlock,
  visibleProfileWishes,
  type StudentProfile as StudentProfileData,
} from "@/lib/mock/feed";
import { ProfileScreen } from "./profile-screen";

const BLOCKED_MESSAGE = "학생을 차단했어요. 서로의 팔로우가 해제돼요.";

const UNBLOCKED_MESSAGE =
  "차단을 해제했어요. 팔로우는 자동으로 복원되지 않아요.";

interface StudentProfileProps {
  profile: StudentProfileData;
}

export function StudentProfile({ profile }: StudentProfileProps) {
  return <StudentProfileContent key={profile.id} profile={profile} />;
}

function StudentProfileContent({ profile }: StudentProfileProps) {
  const [relationship, setRelationship] = useState(profile.relationship);
  const { isBlocked } = relationship;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const toggleBlock = () => {
    setIsMenuOpen(false);
    setRelationship(toggleProfileBlock);
    setToast(isBlocked ? UNBLOCKED_MESSAGE : BLOCKED_MESSAGE);
  };

  return (
    <>
      <ProfileScreen
        nickname={profile.nickname}
        inProgress={visibleProfileWishes(profile.inProgress, relationship)}
        finished={visibleProfileWishes(profile.finished, relationship)}
        backHref="/feed"
        actions={
          isMenuOpen ? (
            <button
              type="button"
              onClick={toggleBlock}
              className={`text-b4 relative z-20 flex h-10 shrink-0 items-center rounded-xl px-4 font-semibold ${
                isBlocked
                  ? "bg-layer-basement text-fg-neutral"
                  : "bg-neutral-inverted text-fg-neutral-inverted"
              }`}
            >
              {isBlocked ? "해제하기" : "차단하기"}
            </button>
          ) : (
            <div className="flex shrink-0 items-center gap-3">
              <Link
                href="/feed/search"
                aria-label="학생 검색"
                className="block size-8"
              >
                <Image src={searchIcon} alt="" width={32} height={32} />
              </Link>
              <button
                type="button"
                aria-label="더보기"
                onClick={() => setIsMenuOpen(true)}
                className="block size-8"
              >
                <Image src={moreIcon} alt="" width={32} height={32} />
              </button>
            </div>
          )
        }
      />

      {isMenuOpen ? (
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-10 cursor-default"
        />
      ) : null}

      {toast === null ? null : (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}
    </>
  );
}
