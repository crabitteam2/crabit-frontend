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

/** 다른 학생의 프로필에 보여줄 위시 묶음입니다. */
export interface StudentProfile {
  /** 학생 식별자입니다. */
  id: string;
  /** 학생의 별명입니다. */
  nickname: string;
  /** 진행중인 위시입니다. */
  inProgress: Wish[];
  /** 완료하거나 포기한 위시입니다. */
  finished: Wish[];
  /** 이 학생이 팔로우한 사람 수입니다. */
  followingCount: number;
  /** 이 학생을 팔로우한 사람 수입니다. */
  followerCount: number;
  /** 내가 이 학생을 팔로우하고 있는지 여부입니다. */
  isFollowing: boolean;
}

const profiles: StudentProfile[] = [
  {
    id: "s1",
    nickname: "박선형",
    inProgress: [
      {
        id: "s1w1",
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
        purpose: "농구공",
        amount: 35_000,
        targetAmount: 35_000,
        state: "COMPLETED",
        startDate: "26.03.02",
        targetDate: "26.06.30",
      },
      {
        id: "s1w3",
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
  isFollowing: true,
  },
  {
    id: "s2",
    nickname: "권아라",
    inProgress: [
      {
        id: "s2w1",
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
  isFollowing: false,
  },
  {
    id: "s3",
    nickname: "오지원",
    inProgress: [],
    finished: [
      {
        id: "s3w1",
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
  isFollowing: false,
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
