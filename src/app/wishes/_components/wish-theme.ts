import type { WishItem } from "./wish-item";

export type WishTone = "pink" | "yellow" | "blue";

export const WISH_TONES: WishTone[] = ["pink", "yellow", "blue"];

export interface WishTheme {
  card: string;
  track: string;
  fill: string;
  fillsTrack: boolean;
  highlightsGoal: boolean;
}

const inProgress: Record<WishTone, WishTheme> = {
  pink: {
    card: "bg-[#fde3ef]",
    track: "bg-[#f8f8f8]",
    fill: "bg-[#fb8fc7]",
    fillsTrack: false,
    highlightsGoal: false,
  },
  yellow: {
    card: "bg-[#fff9ca]",
    track: "bg-[#fffcf0]",
    fill: "bg-[#ffde6b]",
    fillsTrack: false,
    highlightsGoal: false,
  },
  blue: {
    card: "bg-[#cdeffe]",
    track: "bg-[#f8f8f8]",
    fill: "bg-[#618afd]",
    fillsTrack: false,
    highlightsGoal: false,
  },
};

const reached: Record<WishTone, WishTheme> = {
  pink: {
    card: "bg-[linear-gradient(164.47deg,#fdedf4_2.77%,#fb75bb_100%)]",
    track: "bg-[#f8f8f8]",
    fill: "bg-[#c44a8c]",
    fillsTrack: true,
    highlightsGoal: false,
  },
  yellow: {
    card: "bg-[linear-gradient(114.67deg,#fff9ca_3.25%,#ffde6b_100%)]",
    track: "bg-[#f8f8f8]",
    fill: "bg-[#ffc704]",
    fillsTrack: true,
    highlightsGoal: false,
  },
  blue: {
    card: "bg-[linear-gradient(113.44deg,#cdeffe_3.63%,#618afd_100%)]",
    track: "bg-[#f8f8f8]",
    fill: "bg-[#1948cb]",
    fillsTrack: true,
    highlightsGoal: false,
  },
};

const completed: WishTheme = {
  card: "bg-gray-1",
  track: "bg-gray-1",
  fill: "bg-[linear-gradient(to_right,#dedede_0%,#fcb1d6_100%)]",
  fillsTrack: true,
  highlightsGoal: true,
};

const abandoned: WishTheme = {
  card: "bg-gray-1",
  track: "bg-gray-1",
  fill: "bg-gray-4",
  fillsTrack: false,
  highlightsGoal: false,
};

export const emptyWishTheme: WishTheme = {
  card: "bg-pink-1",
  track: "bg-pink-2",
  fill: "",
  fillsTrack: false,
  highlightsGoal: false,
};

export function getWishTheme(wish: WishItem, tone: WishTone, percent: number) {
  if (wish.state === "ABANDONED") return abandoned;
  if (wish.state === "COMPLETED") return completed;
  if (percent >= 100) return reached[tone];
  return inProgress[tone];
}

export const detailWishTheme: WishTheme = {
  card: "",
  track: "bg-pink-2",
  fill: "bg-pink-5",
  fillsTrack: false,
  highlightsGoal: false,
};

export const reachedDetailWishTheme: WishTheme = {
  card: "",
  track: "bg-pink-2",
  fill: "bg-[linear-gradient(to_right,#fdedf4_4.84%,#fb75bb_95.78%)]",
  fillsTrack: true,
  highlightsGoal: false,
};

export const finishedDetailWishTheme: WishTheme = {
  card: "",
  track: "bg-pink-2",
  fill: "bg-[linear-gradient(to_right,#dedede_0%,#fcb1d6_100%)]",
  fillsTrack: true,
  highlightsGoal: true,
};

export const abandonedDetailWishTheme: WishTheme = {
  card: "",
  track: "bg-gray-2",
  fill: "bg-gray-4",
  fillsTrack: false,
  highlightsGoal: false,
};

export const sourceWishTheme: WishTheme = {
  card: "",
  track: "bg-pink-2",
  fill: "bg-pink-6",
  fillsTrack: false,
  highlightsGoal: false,
};
