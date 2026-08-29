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
    },
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
  },
];

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(params: SearchParams, key: string) {
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

/** 학원 피드에 보여줄 공유 카드를 쿼리 조건에 따라 고릅니다. */
export function resolveFeedCards(params: SearchParams): FeedCard[] {
  if (readParam(params, "feed") === "empty") return [];
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
