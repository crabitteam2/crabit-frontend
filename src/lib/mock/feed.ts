import type { Wish } from "./wishes";

/** 학원 피드에 걸린 공유 카드 한 장입니다. */
export interface FeedCard {
  /** 공유 카드 식별자입니다. */
  id: string;
  /** 카드를 올린 학생의 별명입니다. */
  ownerNickname: string;
  /** 카드가 보여주는 위시입니다. */
  wish: Wish;
}

const cards: FeedCard[] = [
  {
    id: "f1",
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
