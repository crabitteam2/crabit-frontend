"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import searchIcon from "@/../public/images/feed/search.svg";
import arrowLeftIcon from "@/../public/images/wishes/arrow-left.svg";
import { Button } from "@/components/ui/button";
import type { components } from "@/lib/http/generated/crabit-backend";
import {
  followAcademyStudent,
  listAcademyStudentFollowers,
  listAcademyStudentFollowing,
  unfollowAcademyStudent,
} from "@/lib/http/follows";
import { createBrowserApiClient } from "@/lib/http/browser";

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

interface FollowListScreenBaseProps {
  backHref: string;
  tab: FollowTab;
  /** 팔로잉 탭으로 가는 경로입니다. */
  followingHref: string;
  /** 팔로워 탭으로 가는 경로입니다. */
  followersHref: string;
}

interface MockFollowListScreenProps extends FollowListScreenBaseProps {
  following: FollowItem[];
  followers: FollowItem[];
}

interface RemoteFollowListScreenProps extends FollowListScreenBaseProps {
  academyId: string;
  ownerStudentId: string;
  initialPage?: components["schemas"]["FollowPage"];
  initialError?: "unavailable" | "failed";
}

type FollowListScreenProps =
  MockFollowListScreenProps | RemoteFollowListScreenProps;

type RemoteError = "unavailable" | "failed" | null;

export function FollowListScreen(props: FollowListScreenProps) {
  const { backHref, tab, followingHref, followersHref } = props;
  const remoteProps = isRemoteFollowList(props) ? props : null;
  const remote = remoteProps !== null;
  const browserClient = useMemo(
    () => (remote ? createBrowserApiClient() : null),
    [remote],
  );
  const [query, setQuery] = useState("");
  const [changed, setChanged] = useState<Readonly<Record<string, boolean>>>({});
  const [page, setPage] = useState<components["schemas"]["FollowPage"] | null>(
    () => remoteProps?.initialPage ?? null,
  );
  const [remoteError, setRemoteError] = useState<RemoteError>(
    () => remoteProps?.initialError ?? null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState<Readonly<Record<string, boolean>>>({});
  const [mutationError, setMutationError] = useState<string | null>(null);
  const requestVersion = useRef(0);

  const loadRemotePage = useCallback(
    async (cursor?: string, append = false) => {
      if (
        remoteProps === null ||
        browserClient === null ||
        remoteProps.initialError !== undefined
      ) {
        return false;
      }

      const version = ++requestVersion.current;
      setIsLoading(true);
      setRemoteError(null);
      const nickname = query.trim() || undefined;
      const request =
        tab === "followers"
          ? listAcademyStudentFollowers(browserClient, {
              academyId: remoteProps.academyId,
              studentId: remoteProps.ownerStudentId,
              cursor,
              nickname,
            })
          : listAcademyStudentFollowing(browserClient, {
              academyId: remoteProps.academyId,
              studentId: remoteProps.ownerStudentId,
              cursor,
              nickname,
            });
      const result = await request;
      if (version !== requestVersion.current) return false;

      setIsLoading(false);
      if (!result.ok) {
        setRemoteError(result.error.status === 404 ? "unavailable" : "failed");
        return false;
      }
      setPage((current) =>
        append && current !== null
          ? { ...result.data, items: [...current.items, ...result.data.items] }
          : result.data,
      );
      return true;
    },
    [browserClient, query, remoteProps, tab],
  );

  useEffect(() => {
    if (remoteProps === null || remoteProps.initialError !== undefined) return;
    if (query.trim() === "") {
      ++requestVersion.current;
      setIsLoading(false);
      setPage(remoteProps.initialPage ?? null);
      setRemoteError(null);
      return;
    }
    void loadRemotePage();
  }, [loadRemotePage, query, remoteProps]);

  const keyword = query.trim();
  const items = remote
    ? (page?.items ?? []).map((item) => ({
        id: item.studentId,
        nickname: item.nickname,
        isFollowing: changed[item.studentId] ?? item.isFollowing,
      }))
    : (tab === "following"
        ? (props as MockFollowListScreenProps).following
        : (props as MockFollowListScreenProps).followers
      ).filter((item) =>
        keyword === "" ? true : item.nickname.includes(keyword),
      );

  const toggleMock = (id: string, isFollowing: boolean) => {
    setChanged((current) => ({ ...current, [id]: !isFollowing }));
  };

  const toggleRemote = async (id: string, isFollowing: boolean) => {
    if (remoteProps === null || browserClient === null || pending[id]) return;

    setPending((current) => ({ ...current, [id]: true }));
    setMutationError(null);
    const result = isFollowing
      ? await unfollowAcademyStudent(browserClient, {
          academyId: remoteProps.academyId,
          studentId: id,
        })
      : await followAcademyStudent(browserClient, {
          academyId: remoteProps.academyId,
          studentId: id,
        });
    setPending((current) => ({ ...current, [id]: false }));
    if (!result.ok) {
      setMutationError(
        "팔로우 상태를 변경하지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
      return;
    }
    setChanged((current) => ({ ...current, [id]: !isFollowing }));
    await loadRemotePage();
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
            placeholder="검색할 학생을 입력해주세요."
            aria-label="학생 검색"
            className="text-fg-neutral placeholder:text-gray-5 min-w-0 flex-1 bg-transparent pl-4 text-[16px] leading-[23px] tracking-[-0.3px] outline-none"
          />
        </div>
      </div>

      {remoteError === "unavailable" ? (
        <p
          role="status"
          className="text-fg-neutral-muted px-4 py-10 text-center text-[16px] leading-[23px]"
        >
          이 목록을 볼 수 없어요.
        </p>
      ) : null}
      {remoteError === "failed" ? (
        <p
          role="alert"
          className="text-fg-neutral-muted px-4 py-10 text-center text-[16px] leading-[23px]"
        >
          목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      ) : null}
      {mutationError === null ? null : (
        <p
          role="alert"
          className="text-error px-4 pb-3 text-center text-[14px]"
        >
          {mutationError}
        </p>
      )}
      {remoteError === null ? (
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
                  isLoading={remote && pending[item.id] === true}
                  onClick={() =>
                    remote
                      ? void toggleRemote(item.id, isFollowing)
                      : toggleMock(item.id, isFollowing)
                  }
                >
                  {isFollowing ? "팔로잉" : "팔로우"}
                </Button>
              </li>
            );
          })}
        </ul>
      ) : null}
      {remote &&
      remoteError === null &&
      page !== null &&
      page.nextCursor !== null ? (
        <div className="px-4 py-4">
          <Button
            size="large"
            variant="weak"
            className="w-full"
            isLoading={isLoading}
            onClick={() =>
              void loadRemotePage(page.nextCursor ?? undefined, true)
            }
          >
            더 보기
          </Button>
        </div>
      ) : null}
      {remote && remoteError === null && isLoading && page === null ? (
        <p
          role="status"
          className="text-fg-neutral-muted px-4 py-4 text-center"
        >
          불러오는 중이에요.
        </p>
      ) : null}
    </div>
  );
}

function isRemoteFollowList(
  props: FollowListScreenProps,
): props is RemoteFollowListScreenProps {
  return "ownerStudentId" in props;
}
