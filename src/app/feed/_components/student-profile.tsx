"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import moreIcon from "@/../public/images/feed/more.svg";
import searchIcon from "@/../public/images/feed/search.svg";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Toast } from "@/components/ui/toast";
import type { StudentProfileItem } from "./feed-item";
import { ProfileScreen } from "./profile-screen";

const BLOCKED_MESSAGE = "친구를 차단했어요.";

const UNBLOCKED_MESSAGE = "차단을 해제했어요.";

const UNFOLLOWED_MESSAGE = "팔로우 취소가 완료되었어요.";

interface StudentProfileProps {
  profile: StudentProfileItem;
}

export function StudentProfile({ profile }: StudentProfileProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing);
  const [isUnfollowAsked, setIsUnfollowAsked] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const toggleBlock = () => {
    setIsMenuOpen(false);
    setIsBlocked((blocked) => !blocked);
    setToast(isBlocked ? UNBLOCKED_MESSAGE : BLOCKED_MESSAGE);
  };

  const unfollow = () => {
    setIsUnfollowAsked(false);
    setIsFollowing(false);
    setToast(UNFOLLOWED_MESSAGE);
  };

  return (
    <>
      <ProfileScreen
        nickname={profile.nickname}
        inProgress={isBlocked ? [] : profile.inProgress}
        finished={isBlocked ? [] : profile.finished}
        backHref="/feed"
        followingCount={profile.followingCount}
        followerCount={
          isFollowing
            ? profile.followerCount
            : Math.max(0, profile.followerCount - 1)
        }
        followsHref={`/feed/${profile.id}/follows`}
        followAction={
          <Button
            size="medium"
            variant={isFollowing ? "weak" : "fill"}
            onClick={() =>
              isFollowing ? setIsUnfollowAsked(true) : setIsFollowing(true)
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
        title="친구를 팔로우 취소할까요?"
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
