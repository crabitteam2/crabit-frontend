"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import moreIcon from "@/../public/images/feed/more.svg";
import searchIcon from "@/../public/images/feed/search.svg";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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

const UNFOLLOWED_MESSAGE = "팔로우 취소가 완료되었어요.";

interface StudentProfileProps {
  profile: StudentProfileData;
}

export function StudentProfile({ profile }: StudentProfileProps) {
  return <StudentProfileContent key={profile.id} profile={profile} />;
}

function StudentProfileContent({ profile }: StudentProfileProps) {
  const [relationship, setRelationship] = useState(profile.relationship);
  const { isBlocked, isBlockedBy, isFollowing, isFollowedBy } = relationship;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUnfollowAsked, setIsUnfollowAsked] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const toggleBlock = () => {
    setIsMenuOpen(false);
    setRelationship(toggleProfileBlock);
    setToast(isBlocked ? UNBLOCKED_MESSAGE : BLOCKED_MESSAGE);
  };

  const unfollow = () => {
    setIsUnfollowAsked(false);
    setRelationship((current) => ({ ...current, isFollowing: false }));
    setToast(UNFOLLOWED_MESSAGE);
  };

  return (
    <>
      <ProfileScreen
        nickname={profile.nickname}
        inProgress={visibleProfileWishes(profile.inProgress, relationship)}
        finished={visibleProfileWishes(profile.finished, relationship)}
        backHref="/feed"
        followingCount={Math.max(
          0,
          profile.followingCount +
            Number(isFollowedBy) -
            Number(profile.relationship.isFollowedBy),
        )}
        followerCount={Math.max(
          0,
          profile.followerCount +
            Number(isFollowing) -
            Number(profile.relationship.isFollowing),
        )}
        followsHref={`/feed/${profile.id}/follows`}
        followAction={
          <Button
            size="medium"
            variant={isFollowing ? "weak" : "fill"}
            disabled={isBlocked || isBlockedBy}
            onClick={() =>
              isFollowing
                ? setIsUnfollowAsked(true)
                : setRelationship((current) => ({
                    ...current,
                    isFollowing: true,
                  }))
            }
          >
            {isFollowing ? "팔로잉" : "팔로우"}
          </Button>
        }
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

      <ConfirmDialog
        isOpen={isUnfollowAsked}
        title="이 학생을 팔로우 취소할까요?"
        primaryLabel="팔로우 취소"
        secondaryLabel="아니요"
        onPrimary={unfollow}
        onSecondary={() => setIsUnfollowAsked(false)}
        onDismiss={() => setIsUnfollowAsked(false)}
      />

      {toast === null ? null : (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}
    </>
  );
}
