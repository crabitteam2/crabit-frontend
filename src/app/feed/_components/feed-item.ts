import type { components } from "@/lib/http/generated/crabit-backend";
import { fromIsoDate } from "@/app/wishes/_components/wish-period-format";
import type { WishItemState } from "@/app/wishes/_components/wish-item";

/** 프로필과 피드 카드가 공통으로 그리는 위시 정보입니다. */
export interface ProfileWishItem {
  /** 공유 카드 식별자입니다. */
  readonly id: string;
  /** 카드가 보여주는 위시 이름입니다. */
  readonly purpose: string;
  /** 0부터 100까지의 진행률이며 모은 금액은 응답에 없습니다. */
  readonly percent: number;
  /** 카드가 진행중인 위시인지 완료한 위시인지 구분합니다. */
  readonly state: WishItemState;
  /** 달력 키 형태의 저축 시작일이며, 정하지 않았으면 null입니다. */
  readonly startDate: string | null;
  /** 달력 키 형태의 목표 날짜이며, 정하지 않았으면 null입니다. */
  readonly targetDate: string | null;
  /** 현재 권한으로 발급된 짧은 사진 URL이며 사진이 없으면 생략합니다. */
  readonly imageUrl?: string;
}

/** 학원 피드에 걸린 공유 카드 한 장입니다. */
export interface FeedCardItem extends ProfileWishItem {
  /** 카드를 올린 학생 식별자입니다. */
  readonly ownerId: string;
  /** 카드를 올린 학생의 별명입니다. */
  readonly ownerNickname: string;
  /** 위시의 목표 금액입니다. */
  readonly targetAmount: number;
}

/** 백엔드 공유 카드 계약을 피드 화면이 쓰는 모델로 옮깁니다. */
export function toFeedCardItem(
  card: components["schemas"]["SharedCard"],
): FeedCardItem {
  return {
    id: card.sharedCardId,
    ownerId: card.ownerId,
    ownerNickname: card.ownerNickname,
    purpose: card.purpose,
    targetAmount: card.targetAmount,
    percent: card.progressPercent,
    state: toWishItemState(card),
    startDate: fromIsoDate(card.startDate),
    targetDate: fromIsoDate(card.targetDate),
    ...(card.photo == null ? {} : { imageUrl: card.photo.variants.large }),
  };
}

function toWishItemState(
  card: components["schemas"]["SharedCard"],
): WishItemState {
  switch (card.kind) {
    case "ABANDONMENT":
      return card.state;
    case "COMPLETION":
      return "COMPLETED";
    case "PROGRESS":
      return "IN_PROGRESS";
  }
}

/** 다른 학생 프로필 화면이 그리는 데 필요한 정보입니다. */
export interface StudentProfileItem {
  /** 학생 식별자입니다. */
  readonly id: string;
  /** 학생의 별명입니다. */
  readonly nickname: string;
  /** 진행중인 위시로 공유한 카드입니다. */
  readonly inProgress: ProfileWishItem[];
  /** 완료한 위시로 공유한 카드입니다. */
  readonly finished: ProfileWishItem[];
  /** 이 학생이 팔로우한 사람 수이며 대응 API가 없어 0입니다. */
  readonly followingCount: number;
  /** 이 학생을 팔로우한 사람 수이며 대응 API가 없어 0입니다. */
  readonly followerCount: number;
  /** 내가 이 학생을 팔로우하고 있는지 여부입니다. */
  readonly isFollowing: boolean;
}

/** 학생 조회와 공유 카드 목록을 프로필 화면 모델로 합칩니다. */
export function toStudentProfileItem(
  student: components["schemas"]["StudentRelationship"],
  cards: components["schemas"]["SharedCard"][],
): StudentProfileItem {
  const items = cards.map(toFeedCardItem);

  return {
    id: student.studentId,
    nickname: student.nickname,
    inProgress: items.filter((item) => item.state !== "COMPLETED"),
    finished: items.filter((item) => item.state === "COMPLETED"),
    followingCount: 0,
    followerCount: 0,
    isFollowing: student.isFollowing,
  };
}
