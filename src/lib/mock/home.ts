import { findWish } from "./wishes";

export const ACADEMY_NAME = "크래빗 영어학원";

export interface HomeCard {
  ownerName: string;
  balance: number;
  wishAvailableBalance: number;
}

export const homeCard: HomeCard = {
  ownerName: "권아라",
  balance: 100_000,
  wishAvailableBalance: 100_000,
};

export interface RepresentativeWish {
  purpose: string;
  amount: number;
  targetAmount: number;
}

export interface HomeData {
  nickname: string;
  representativeWish: RepresentativeWish | null;
  unresolvedShortage: number;
}

export const homeData: HomeData = {
  nickname: "아라",
  representativeWish: {
    purpose: "시나모롤 키링",
    amount: 5000,
    targetAmount: 50000,
  },
  unresolvedShortage: 0,
};

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(params: SearchParams, key: string) {
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

function readNumber(params: SearchParams, key: string) {
  const value = readParam(params, key);
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function resolveRepresentative(params: SearchParams) {
  const wishId = readParam(params, "representative");
  const picked = wishId === undefined ? null : findWish(wishId);
  if (picked === null) return homeData.representativeWish;
  return {
    purpose: picked.purpose,
    amount: picked.amount,
    targetAmount: picked.targetAmount,
  };
}

export function resolveHomeData(params: SearchParams): HomeData {
  const shortage = readNumber(params, "shortage") ?? homeData.unresolvedShortage;

  if (params.wish === "none") {
    return {
      ...homeData,
      representativeWish: null,
      unresolvedShortage: shortage,
    };
  }

  const amount = readNumber(params, "amount");
  const target = readNumber(params, "target");
  const representative = resolveRepresentative(params);

  return {
    ...homeData,
    representativeWish: representative && {
      ...representative,
      amount: amount ?? representative.amount,
      targetAmount: target ?? representative.targetAmount,
    },
    unresolvedShortage: shortage,
  };
}
