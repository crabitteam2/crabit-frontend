export const ACADEMY_NAME = "크래빗 영어학원";

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

function readNumber(params: SearchParams, key: string) {
  const raw = params[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function resolveHomeData(params: SearchParams): HomeData {
  const shortage = readNumber(params, "shortage") ?? homeData.unresolvedShortage;

  if (params.wish === "none") {
    return { ...homeData, representativeWish: null, unresolvedShortage: shortage };
  }

  const amount = readNumber(params, "amount");
  const target = readNumber(params, "target");

  return {
    ...homeData,
    representativeWish: homeData.representativeWish && {
      ...homeData.representativeWish,
      amount: amount ?? homeData.representativeWish.amount,
      targetAmount: target ?? homeData.representativeWish.targetAmount,
    },
    unresolvedShortage: shortage,
  };
}
