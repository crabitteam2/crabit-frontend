/** 홈 화면에 표시하는 기본 학원 이름입니다. */
export const ACADEMY_NAME = "크래빗 영어학원";

/** 홈 목업의 대표 위시입니다. */
export interface RepresentativeWish {
  /** 저축 목적입니다. */
  purpose: string;
  /** 현재 저축 금액입니다. */
  amount: number;
  /** 목표 금액입니다. */
  targetAmount: number;
}

/** 홈 화면을 렌더링하는 목업 데이터입니다. */
export interface HomeData {
  /** 사용자 닉네임입니다. */
  nickname: string;
  /** 대표 위시이며, `null`이면 빈 상태를 표시합니다. */
  representativeWish: RepresentativeWish | null;
  /** 0보다 크면 잔액 부족 안내와 잠긴 바로가기를 표시합니다. */
  unresolvedShortage: number;
}

/** 기본 홈 목업 데이터입니다. */
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

/**
 * 개발용 쿼리 값을 기본 홈 목업에 적용합니다.
 * 숫자로 해석할 수 없는 값은 무시하고 `wish=none`이면 대표 위시를 제거합니다.
 */
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
