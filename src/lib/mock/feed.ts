import type { components } from "../http/generated/crabit-backend";
import type { Wish } from "./wishes";

/** 학원 피드에 걸린 공유 카드 한 장입니다. */
export interface FeedCard {
  /** 공유 카드 식별자입니다. */
  id: string;
  /** 카드를 올린 학생 식별자입니다. */
  studentId: string;
  /** 카드를 올린 학생의 별명입니다. */
  ownerNickname: string;
  /** 카드가 보여주는 위시입니다. */
  wish: Wish;
  /** 카드를 올린 시각이며 최신순 정렬에 씁니다. */
  sharedAt: string;
}

const cards: FeedCard[] = [
  {
    id: "f1",
    studentId: "s1",
    ownerNickname: "선형",
    wish: {
      id: "fw1",
      purpose: "여름 방학 캠프",
      amount: 20_000,
      targetAmount: 100_000,
      state: "IN_PROGRESS",
      startDate: "26.08.24",
      targetDate: "26.10.25",
    },
    sharedAt: "2026-08-26T09:00:00+09:00",
  },
  {
    id: "f2",
    studentId: "s2",
    ownerNickname: "아라",
    wish: {
      id: "fw2",
      purpose: "산리오 스티커 세트",
      amount: 27_000,
      targetAmount: 30_000,
      state: "IN_PROGRESS",
      startDate: "26.07.01",
      targetDate: "26.09.30",
      imageUrl: "/images/wishes/deposit-hero.png",
    },
    sharedAt: "2026-08-29T18:30:00+09:00",
  },
  {
    id: "f3",
    studentId: "s3",
    ownerNickname: "지원",
    wish: {
      id: "fw3",
      purpose: "스포츠카 레고",
      amount: 45_000,
      targetAmount: 45_000,
      state: "COMPLETED",
      startDate: "26.01.05",
      targetDate: "26.05.31",
    },
    sharedAt: "2026-08-28T12:10:00+09:00",
  },
];

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(params: SearchParams, key: string) {
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

/** 학원 피드가 지원하는 정렬 기준입니다. */
export type FeedSort = "recommended" | "latest";

/** 쿼리에서 정렬 기준을 읽습니다. 값이 없으면 추천순입니다. */
export function resolveFeedSort(params: SearchParams): FeedSort {
  return readParam(params, "sort") === "latest" ? "latest" : "recommended";
}

/** 학원 피드에 보여줄 공유 카드를 쿼리 조건에 따라 고릅니다. */
export function resolveFeedCards(params: SearchParams): FeedCard[] {
  if (readParam(params, "feed") === "empty") return [];
  if (resolveFeedSort(params) === "latest") {
    return [...cards].sort((a, b) => b.sharedAt.localeCompare(a.sharedAt));
  }
  return cards;
}

/** 가상 공유 위시에도 실제 계약의 공개 범위를 명시합니다. */
export interface SharedProfileWish extends Wish {
  visibility: components["schemas"]["WishVisibility"];
}

/** 가상 프로필의 본인 기준 양방향 관계와 차단입니다. */
export interface ProfileRelationship {
  isFollowing: boolean;
  isFollowedBy: boolean;
  isBlocked: boolean;
  isBlockedBy: boolean;
}

/** 차단하면 두 방향을 종료하며 해제는 관계를 복원하지 않습니다. */
export function toggleProfileBlock(
  relationship: ProfileRelationship,
): ProfileRelationship {
  return {
    ...relationship,
    isBlocked: !relationship.isBlocked,
    isFollowing: false,
    isFollowedBy: false,
  };
}

/** viewer → owner만 팔로워 공개를 허용하며 어느 방향 차단도 우선합니다. */
export function visibleProfileWishes(
  wishes: SharedProfileWish[],
  relationship: ProfileRelationship,
): SharedProfileWish[] {
  if (relationship.isBlocked || relationship.isBlockedBy) return [];
  return wishes.filter(
    (wish) =>
      wish.visibility === "ACADEMY" ||
      (wish.visibility === "FOLLOWERS" && relationship.isFollowing),
  );
}

/** 다른 학생의 프로필에 보여줄 위시 묶음입니다. */
export interface StudentProfile {
  /** 학생 식별자입니다. */
  id: string;
  /** 학생의 별명입니다. */
  nickname: string;
  /** 진행중인 위시입니다. */
  inProgress: SharedProfileWish[];
  /** 완료하거나 포기한 위시입니다. */
  finished: SharedProfileWish[];
  /** 현재 학원의 독립적인 양방향 팔로우 상태입니다. */
  relationship: ProfileRelationship;
  /** 이 학생이 팔로우한 사람 수입니다. */
    followingCount: number;
  /** 이 학생을 팔로우한 사람 수입니다. */
    followerCount: number;
}

const profiles: StudentProfile[] = [
  {
    id: "s1",
    relationship: {
      isFollowing: true,
      isFollowedBy: true,
      isBlocked: false,
      isBlockedBy: false,
    },
    nickname: "박선형",
    inProgress: [
      {
        id: "s1w1",
        visibility: "FOLLOWERS",
        purpose: "여름 방학 캠프",
        amount: 20_000,
        targetAmount: 100_000,
        state: "IN_PROGRESS",
        startDate: "26.08.24",
        targetDate: "26.10.25",
        imageUrl: "/images/wishes/deposit-hero.png",
      },
    ],
    finished: [
      {
        id: "s1w2",
        visibility: "FOLLOWERS",
        purpose: "농구공",
        amount: 35_000,
        targetAmount: 35_000,
        state: "COMPLETED",
        startDate: "26.03.02",
        targetDate: "26.06.30",
      },
      {
        id: "s1w3",
        visibility: "ACADEMY",
        purpose: "보드게임",
        amount: 9_000,
        targetAmount: 40_000,
        state: "ABANDONED",
        startDate: "26.01.10",
        targetDate: "26.04.30",
      },
    ],
    followingCount: 12,
    followerCount: 128,
  },
  {
    id: "s2",
    relationship: {
      isFollowing: true,
      isFollowedBy: false,
      isBlocked: false,
      isBlockedBy: false,
    },
    nickname: "권아라",
    inProgress: [
      {
        id: "s2w1",
        visibility: "FOLLOWERS",
        purpose: "산리오 스티커 세트",
        amount: 27_000,
        targetAmount: 30_000,
        state: "IN_PROGRESS",
        startDate: "26.07.01",
        targetDate: "26.09.30",
      },
    ],
    finished: [],
    followingCount: 3,
    followerCount: 7,
  },
  {
    id: "s3",
    relationship: {
      isFollowing: false,
      isFollowedBy: true,
      isBlocked: false,
      isBlockedBy: false,
    },
    nickname: "오지원",
    inProgress: [],
    finished: [
      {
        id: "s3w1",
        visibility: "ACADEMY",
        purpose: "스포츠카 레고",
        amount: 45_000,
        targetAmount: 45_000,
        state: "COMPLETED",
        startDate: "26.01.05",
        targetDate: "26.05.31",
      },
    ],
    followingCount: 0,
    followerCount: 1,
  },
];

/** 학생 식별자로 프로필을 찾고, 없으면 null을 돌려줍니다. */
export function findStudentProfile(studentId: string): StudentProfile | null {
  return profiles.find((profile) => profile.id === studentId) ?? null;
}

/** 검색 화면에 처음 보여줄 최근 검색어입니다. */
export const RECENT_SEARCHES = ["박선형", "권아라", "오지원"];

/** 닉네임에 검색어가 들어간 학생을 찾습니다. */
export function searchStudents(query: string): StudentProfile[] {
  const keyword = query.trim();
  if (keyword === "") return [];
  return profiles.filter((profile) => profile.nickname.includes(keyword));
}

/** 팔로우 목록 한 줄에 필요한 학생 정보입니다. */
export interface FollowEntry {
  id: string;
  nickname: string;
  isFollowing: boolean;
}

const followEntries: FollowEntry[] = [
  { id: "s1", nickname: "박선형", isFollowing: true },
  { id: "s2", nickname: "권아라", isFollowing: false },
  { id: "s3", nickname: "오지원", isFollowing: false },
  { id: "s4", nickname: "김도윤", isFollowing: true },
  { id: "s5", nickname: "이하준", isFollowing: false },
  { id: "s6", nickname: "최서아", isFollowing: true },
];

/** 팔로잉 목록입니다. 내가 팔로우한 학생만 담습니다. */
export const FOLLOWING_ENTRIES = followEntries.filter(
  (entry) => entry.isFollowing,
);

/** 팔로워 목록입니다. 나를 팔로우한 학생을 담습니다. */
export const FOLLOWER_ENTRIES = followEntries;
