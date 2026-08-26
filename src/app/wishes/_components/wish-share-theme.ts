import abandonedImage from "@/../public/images/wishes/share-abandoned.png";
import completedImage from "@/../public/images/wishes/share-completed.png";
import inProgressImage from "@/../public/images/wishes/wish-created.png";
import type { Wish } from "@/lib/mock/wishes";
import type { HeroCharacter } from "./wish-hero-screen";
import type { WishTheme } from "./wish-theme";

export interface WishShareLook {
  character: HeroCharacter;
  headline: string;
  headlinePaddingTop: number;
  headlinePaddingBottom: number;
  theme: WishTheme;
}

const inProgress: WishShareLook = {
  character: {
    src: inProgressImage,
    width: 200,
    height: 231,
    crop: { size: 305.5, left: -49.9, top: -27.6 },
  },
  headline: "목표를 향해 전진중이에요!",
  headlinePaddingTop: 28,
  headlinePaddingBottom: 24,
  theme: {
    card: "",
    track: "bg-pink-2",
    fill: "bg-pink-5",
    fillsTrack: false,
    highlightsGoal: false,
  },
};

const completed: WishShareLook = {
  character: { src: completedImage, width: 310, height: 238 },
  headline: "목표를 달성했어요!",
  headlinePaddingTop: 22,
  headlinePaddingBottom: 23,
  theme: {
    card: "",
    track: "bg-pink-5",
    fill: "",
    fillsTrack: false,
    highlightsGoal: false,
  },
};

const abandoned: WishShareLook = {
  character: { src: abandonedImage, width: 200, height: 232 },
  headline: "다음에는 더 잘 할 수 있어요.",
  headlinePaddingTop: 28,
  headlinePaddingBottom: 23,
  theme: {
    card: "",
    track: "bg-gray-3",
    fill: "bg-gray-5",
    fillsTrack: false,
    highlightsGoal: false,
  },
};

export function getWishShareLook(wish: Wish): WishShareLook {
  if (wish.state === "ABANDONED") return abandoned;
  if (wish.state === "COMPLETED") return completed;
  return inProgress;
}
