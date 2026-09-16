import type { components } from "@/lib/http/generated/crabit-backend";
import { fromIsoDate } from "@/app/wishes/_components/wish-period-format";
import type { ProfileWishItem } from "../_components/feed-item";

/** 내 프로필에는 내 공개 위시만 표시하며 완료·포기 시점의 진행률을 보존합니다. */
export function toOwnedProfileWishes(wishes: components["schemas"]["Wish"][]) {
  const items: ProfileWishItem[] = wishes
    .filter((wish) => wish.visibility !== "PRIVATE")
    .sort(
      (a, b) =>
        b.updatedAt.localeCompare(a.updatedAt) || b.id.localeCompare(a.id),
    )
    .map((wish) => {
      if (wish.state === "ABANDONED" && wish.abandonmentAmount === null)
        throw new Error("Missing abandonment amount");
      const amount =
        wish.state === "ABANDONED" ? wish.abandonmentAmount! : wish.amount;
      const percent =
        wish.state === "COMPLETED" || wish.state === "AMOUNT_REACHED"
          ? 100
          : Math.min(
              wish.state === "IN_PROGRESS" ? 99 : 100,
              Math.floor((amount * 100) / wish.targetAmount),
            );
      return {
        id: wish.id,
        purpose: wish.purpose,
        percent,
        state: wish.state,
        startDate: fromIsoDate(wish.startDate),
        targetDate: fromIsoDate(wish.targetDate),
        ...(wish.photo ? { photo: wish.photo.variants } : {}),
      };
    });
  return {
    inProgress: items.filter(
      (wish) => wish.state === "IN_PROGRESS" || wish.state === "AMOUNT_REACHED",
    ),
    finished: items.filter(
      (wish) => wish.state === "COMPLETED" || wish.state === "ABANDONED",
    ),
  };
}
