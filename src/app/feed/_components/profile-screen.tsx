import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { TopButton } from "@/app/wishes/_components/top-button";
import heroImage from "@/../public/images/feed/profile-hero.png";
import searchIcon from "@/../public/images/feed/search.svg";
import arrowLeftIcon from "@/../public/images/wishes/arrow-left.svg";
import type { Wish } from "@/lib/mock/wishes";
import { ProfileWishSection } from "./profile-wish-section";

interface ProfileScreenProps {
  nickname: string;
  inProgress: Wish[];
  finished: Wish[];
  backHref: string;
  /** 팔로우한 사람 수입니다. */
  followingCount: number;
  /** 팔로우한 사람에게서 받은 팔로워 수입니다. */
  followerCount: number;
  /** 팔로잉과 팔로워 수를 눌렀을 때 갈 목록 경로입니다. */
  followsHref: string;
  /** 헤더 오른쪽에 놓을 요소이며, 없으면 검색 버튼만 보여줍니다. */
  actions?: ReactNode;
  /** 별명 오른쪽에 놓을 팔로우 버튼이며, 내 프로필에서는 없습니다. */
  followAction?: ReactNode;
}

export function ProfileScreen({
  nickname,
  inProgress,
  finished,
  backHref,
  followingCount,
  followerCount,
  followsHref,
  actions,
  followAction,
}: ProfileScreenProps) {
  return (
    <div className="flex flex-col">
      <div className="relative h-[348px] w-full overflow-hidden bg-gradient-to-b from-[#fcb1d6] to-[#f8f8f8]">
        <Image
          src={heroImage}
          alt=""
          width={320}
          height={320}
          priority
          className="absolute top-[73px] left-1/2 size-[320px] -translate-x-1/2 object-cover"
        />
        <header className="relative flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
          <Link
            href={backHref}
            aria-label="뒤로 가기"
            className="relative block size-8 shrink-0"
          >
            <Image src={arrowLeftIcon} alt="" fill sizes="32px" />
          </Link>
          {actions ?? (
            <Link
              href="/feed/search"
              aria-label="학생 검색"
              className="block size-8"
            >
              <Image src={searchIcon} alt="" width={32} height={32} />
            </Link>
          )}
        </header>
      </div>

      <div className="border-gray-3 flex items-center justify-between border-b px-4 py-3">
        <h1 className="text-t2 text-fg-neutral font-semibold">{nickname}</h1>
        {followAction}
      </div>

      <div className="border-gray-3 flex items-center border-b px-4 py-5">
        <div className="flex flex-1 items-center justify-between text-[17px] leading-6 tracking-[-0.3px]">
          <ProfileCount
            label="팔로잉"
            value={String(followingCount)}
            href={followsHref}
          />
          <ProfileCount
            label="팔로워"
            value={String(followerCount)}
            href={`${followsHref}?tab=followers`}
          />
          <ProfileCount
            label="진행중"
            value={toCountLabel(inProgress.length)}
          />
          <ProfileCount label="종료" value={toCountLabel(finished.length)} />
        </div>
      </div>

      <ProfileWishSection title="진행중인 위시" wishes={inProgress} />
      <ProfileWishSection title="종료된 위시" wishes={finished} />
      <TopButton />
    </div>
  );
}

function ProfileCount({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <>
      <span className="text-fg-neutral">{label}</span>
      <span className="text-pink-6 font-semibold">{value}</span>
    </>
  );

  if (href === undefined) {
    return <p className="flex items-center gap-1">{body}</p>;
  }

  return (
    <Link href={href} className="flex items-center gap-1">
      {body}
    </Link>
  );
}

function toCountLabel(count: number) {
  return count > 99 ? "99+" : String(count);
}
