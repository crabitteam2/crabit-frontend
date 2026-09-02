"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import searchIcon from "@/../public/images/feed/search.svg";
import arrowLeftIcon from "@/../public/images/wishes/arrow-left.svg";
import { Button } from "@/components/ui/button";

/** 팔로잉과 팔로워 중 어느 목록을 보고 있는지 나타냅니다. */
export type FollowTab = "following" | "followers";

/** 목록 한 줄에 그릴 학생입니다. */
export interface FollowItem {
  id: string;
  nickname: string;
  isFollowing: boolean;
}

const TABS: { value: FollowTab; label: string }[] = [
  { value: "following", label: "팔로잉" },
  { value: "followers", label: "팔로워" },
];

interface FollowListScreenProps {
  backHref: string;
  tab: FollowTab;
  /** 팔로잉 탭으로 가는 경로입니다. */
  followingHref: string;
  /** 팔로워 탭으로 가는 경로입니다. */
  followersHref: string;
  following: FollowItem[];
  followers: FollowItem[];
}

export function FollowListScreen({
  backHref,
  tab,
  followingHref,
  followersHref,
  following,
  followers,
}: FollowListScreenProps) {
  const [query, setQuery] = useState("");
  const [changed, setChanged] = useState<Readonly<Record<string, boolean>>>({});

  const keyword = query.trim();
  const items = (tab === "following" ? following : followers).filter((item) =>
    keyword === "" ? true : item.nickname.includes(keyword),
  );

  const toggle = (id: string, isFollowing: boolean) => {
    setChanged((current) => ({ ...current, [id]: !isFollowing }));
  };

  return (
    <div className="flex flex-col">
      <header className="border-gray-3 flex items-center border-b px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
        <Link
          href={backHref}
          aria-label="뒤로 가기"
          className="relative block size-8 shrink-0"
        >
          <Image src={arrowLeftIcon} alt="" fill sizes="32px" />
        </Link>
        <nav className="flex flex-1 items-center justify-center gap-6">
          {TABS.map((item) => (
            <Link
              key={item.value}
              href={item.value === "followers" ? followersHref : followingHref}
              aria-current={item.value === tab ? "page" : undefined}
              className={`text-[16px] leading-[23px] tracking-[-0.3px] ${
                item.value === tab
                  ? "text-pink-6 font-semibold"
                  : "text-gray-5 font-normal"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <span aria-hidden="true" className="size-8 shrink-0" />
      </header>

      <div className="px-4 py-4">
        <div className="bg-pink-1 flex min-w-0 items-center rounded-[10px] p-2">
          <Image
            src={searchIcon}
            alt=""
            width={32}
            height={32}
            className="shrink-0"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="검색할 친구를 입력해주세요."
            aria-label="친구 검색"
            className="text-fg-neutral placeholder:text-gray-5 min-w-0 flex-1 bg-transparent pl-4 text-[16px] leading-[23px] tracking-[-0.3px] outline-none"
          />
        </div>
      </div>

      <ul aria-label={tab === "following" ? "팔로잉 목록" : "팔로워 목록"}>
        {items.map((item) => {
          const isFollowing = changed[item.id] ?? item.isFollowing;
          return (
            <li
              key={item.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <Link
                href={`/feed/${item.id}`}
                className="text-t2 text-fg-neutral font-semibold"
              >
                {item.nickname}
              </Link>
              <Button
                size="medium"
                variant={isFollowing ? "weak" : "fill"}
                onClick={() => toggle(item.id, isFollowing)}
              >
                {isFollowing ? "팔로잉" : "팔로우"}
              </Button>
            </li>
          );
        })}
      </ul>

      {items.length === 0 ? (
        <p className="text-gray-7 px-4 py-16 text-center text-[16px] leading-[23px] font-medium tracking-[-0.3px]">
          찾는 친구가 없어요.
        </p>
      ) : null}
    </div>
  );
}
