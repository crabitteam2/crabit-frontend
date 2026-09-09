import { NICKNAME } from "./home";

/**
 * 주간 리캡 화면을 확인하려고 둔 시연용 값입니다.
 *
 * API를 붙이면 이 파일을 지웁니다.
 */
export const WEEKLY_RECAP_MOCK = {
  savings: {
    headline: `지난주에 총 5번 저축했어요.
3주 연속 저축 유지 중! 🔥🔥🔥`,
    netSavings: 32_000,
    newWishCount: 0,
  },
  growth: {
    headline: "내 위시리스트 조회수가 성장 가능성이 있어요.",
    description: `내 피드를 42명의 친구가 구경했어요! 효과적인 성장을 원한다면
매주 새로운 위시를 피드에 공유하는 것 부터 시작해보세요.`,
    nickname: NICKNAME,
    totalVisits: 56,
    growthPct: 15,
  },
  stories: {
    headline: `지난주 우리학원의 위시를 달성한
친구들이 있어요.`,
    description: "불도저형 토끼 지원이가 '포켓몬 카드' 위시를 완주했어요!",
    cards: [
      {
        id: "00000000-0000-0000-0000-000000000901",
        nickname: "지원",
        purpose: "포켓몬 카드",
        period: "26.08.24 ~26.08.25",
      },
    ],
  },
} as const;
