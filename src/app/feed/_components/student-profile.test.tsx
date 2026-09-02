import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { findStudentProfile, visibleProfileWishes } from "@/lib/mock/feed";
import { StudentProfile } from "./student-profile";

const profile = findStudentProfile("s1")!;

describe("mock profile directional visibility", () => {
  it("keeps follower-only wishes hidden after block and unblock while academy wishes can return", async () => {
    const user = userEvent.setup();
    render(<StudentProfile profile={profile} />);
    expect(screen.getByText("여름 방학 캠프")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "더보기" }));
    await user.click(screen.getByRole("button", { name: "차단하기" }));
    expect(screen.queryByText("여름 방학 캠프")).not.toBeInTheDocument();
    expect(screen.queryByText("보드게임")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "더보기" }));
    await user.click(screen.getByRole("button", { name: "해제하기" }));
    expect(screen.queryByText("여름 방학 캠프")).not.toBeInTheDocument();
    expect(screen.queryByText("농구공")).not.toBeInTheDocument();
    expect(screen.getByText("보드게임")).toBeInTheDocument();
    expect(
      screen.getByText("차단을 해제했어요. 팔로우는 자동으로 복원되지 않아요."),
    ).toBeInTheDocument();
  });

  it("resets local relationship state when navigating to a different student", () => {
    const { rerender } = render(<StudentProfile profile={profile} />);
    expect(screen.getByText("여름 방학 캠프")).toBeInTheDocument();
    rerender(
      <StudentProfile
        profile={{
          ...profile,
          id: "incoming-only",
          nickname: "새 학생",
          relationship: {
            ...profile.relationship,
            isFollowing: false,
            isFollowedBy: true,
          },
        }}
      />,
    );
    expect(screen.queryByText("여름 방학 캠프")).not.toBeInTheDocument();
  });

  it("requires viewer-to-owner follow and keeps the opposite block effective", () => {
    const relationship = {
      isFollowing: false,
      isFollowedBy: true,
      isBlocked: false,
      isBlockedBy: false,
    };
    expect(visibleProfileWishes(profile.inProgress, relationship)).toEqual([]);
    expect(
      visibleProfileWishes(profile.inProgress, {
        ...relationship,
        isFollowing: true,
      }),
    ).toHaveLength(1);
    expect(
      visibleProfileWishes(profile.finished, {
        ...relationship,
        isFollowing: true,
        isBlockedBy: true,
      }),
    ).toEqual([]);
    expect(
      visibleProfileWishes(
        [{ ...profile.inProgress[0], visibility: "PRIVATE" }],
        { ...relationship, isFollowing: true },
      ),
    ).toEqual([]);
  });
});
