"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import moreIcon from "@/../public/images/feed/more.svg";
import searchIcon from "@/../public/images/feed/search.svg";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Toast, type ToastTone } from "@/components/ui/toast";
import {
  blockStudentAction,
  followStudentAction,
  unblockStudentAction,
  unfollowStudentAction,
  type RelationshipActionResult,
} from "../follow-actions";
import type { StudentProfileItem } from "./feed-item";
import { ProfileScreen } from "./profile-screen";

const BLOCKED_MESSAGE = "차단이 완료되었어요.";

const UNBLOCKED_MESSAGE = "차단을 해제했어요. 다시 활동을 볼 수 있어요.";

const UNFOLLOWED_MESSAGE = "팔로우 취소가 완료되었어요.";

type PendingAction = "follow" | "unfollow" | "block" | "unblock";

interface StudentProfileProps {
  academyId: string;
  profile: StudentProfileItem;
  /** 들어올 때 이미 차단한 학생인지 여부입니다. */
  isBlocked?: boolean;
  /** 차단만 걸린 채로 들어왔다가 해제해 프로필을 다시 읽어야 할 때 부릅니다. */
  onUnblocked?: () => void;
}

export function StudentProfile({
  academyId,
  profile,
  isBlocked: blockedOnEntry = false,
  onUnblocked,
}: StudentProfileProps) {
  const [isBlocked, setIsBlocked] = useState(blockedOnEntry);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing);
  const [followerCount, setFollowerCount] = useState(profile.followerCount);
  const [isUnfollowAsked, setIsUnfollowAsked] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    tone: ToastTone;
  } | null>(null);

  const run = async (
    action: PendingAction,
    request: () => Promise<RelationshipActionResult>,
  ) => {
    setPending(action);
    const result = await request();
    setPending(null);
    if (!result.ok) setToast({ message: result.message, tone: "danger" });

    return result.ok;
  };

  const follow = async () => {
    if (
      !(await run("follow", () => followStudentAction(academyId, profile.id)))
    )
      return;

    setIsFollowing(true);
    setFollowerCount((count) => count + 1);
  };

  const unfollow = async () => {
    const isDone = await run("unfollow", () =>
      unfollowStudentAction(academyId, profile.id),
    );
    setIsUnfollowAsked(false);
    if (!isDone) return;

    setIsFollowing(false);
    setFollowerCount((count) => Math.max(0, count - 1));
    setToast({ message: UNFOLLOWED_MESSAGE, tone: "success" });
  };

  const block = async () => {
    setIsMenuOpen(false);
    if (!(await run("block", () => blockStudentAction(profile.id)))) return;

    setIsBlocked(true);
    if (isFollowing) setFollowerCount((count) => Math.max(0, count - 1));
    setIsFollowing(false);
    setToast({ message: BLOCKED_MESSAGE, tone: "success" });
  };

  const unblock = async () => {
    setIsMenuOpen(false);
    if (!(await run("unblock", () => unblockStudentAction(profile.id)))) return;

    setIsBlocked(false);
    if (blockedOnEntry) {
      onUnblocked?.();
      return;
    }

    setToast({ message: UNBLOCKED_MESSAGE, tone: "success" });
  };

  return (
    <>
      <ProfileScreen
        nickname={profile.nickname}
        inProgress={isBlocked ? [] : profile.inProgress}
        finished={isBlocked ? [] : profile.finished}
        backHref={`/feed?academyId=${encodeURIComponent(academyId)}`}
        followingCount={profile.followingCount}
        followerCount={followerCount}
        followsHref={`/feed/${profile.id}/follows?academyId=${encodeURIComponent(academyId)}`}
        showCounts={!isBlocked}
        followAction={
          isBlocked ? undefined : (
            <Button
              size="medium"
              variant={isFollowing ? "weak" : "fill"}
              isLoading={pending === "follow"}
              disabled={pending !== null}
              onClick={() =>
                isFollowing ? setIsUnfollowAsked(true) : void follow()
              }
            >
              {isFollowing ? "팔로잉" : "팔로우"}
            </Button>
          )
        }
        actions={
          isMenuOpen ? (
            <button
              type="button"
              disabled={pending !== null}
              onClick={() => void (isBlocked ? unblock() : block())}
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
        loadingButton={pending === "unfollow" ? "primary" : undefined}
        onPrimary={() => void unfollow()}
        onSecondary={() => setIsUnfollowAsked(false)}
        onDismiss={() => setIsUnfollowAsked(false)}
      />

      {toast === null ? null : (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
