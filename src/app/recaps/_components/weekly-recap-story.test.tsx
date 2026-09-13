import { fireEvent, render } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { WeeklyRecapStory } from "./weekly-recap-story";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span aria-label={alt} />,
}));

const view = {
  savings: { headline: "저축", netSavings: 42_000, newWishCount: 1 },
  growth: {
    headline: "성장",
    description: "설명",
    nickname: "아라",
    totalVisits: 8,
    growthPct: 60,
  },
  stories: { headline: "완주", description: "설명", cards: [] },
} satisfies Omit<
  Parameters<typeof WeeklyRecapStory>[0],
  "closeHref" | "feedHref"
>;

it("마지막 장을 넘기면 닫기와 같은 곳으로 나간다", () => {
  const { container } = render(
    <WeeklyRecapStory closeHref="/" feedHref="/feed" {...view} />,
  );
  const frame = container.firstElementChild as HTMLElement;
  const tapForward = () => {
    fireEvent.pointerDown(frame, { clientX: 300 });
    fireEvent.pointerUp(frame, { clientX: 300 });
  };

  tapForward();
  tapForward();
  expect(replace).not.toHaveBeenCalled();

  tapForward();
  expect(replace).toHaveBeenCalledWith("/");
});
