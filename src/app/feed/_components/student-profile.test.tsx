import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => (
    // oxlint-disable-next-line next/no-img-element -- The test mock does not need Next image handling.
    <img alt={alt} />
  ),
}));

const followStudentAction = vi.fn();
const unfollowStudentAction = vi.fn();
const blockStudentAction = vi.fn();
const unblockStudentAction = vi.fn();

vi.mock("../follow-actions", () => ({
  followStudentAction: (...args: unknown[]) => followStudentAction(...args),
  unfollowStudentAction: (...args: unknown[]) => unfollowStudentAction(...args),
  blockStudentAction: (...args: unknown[]) => blockStudentAction(...args),
  unblockStudentAction: (...args: unknown[]) => unblockStudentAction(...args),
}));

import type { StudentProfileItem } from "./feed-item";
import { StudentProfile } from "./student-profile";

const academyId = "11111111-1111-4111-8111-111111111111";
const studentId = "22222222-2222-4222-8222-222222222222";

const profileOf = (
  overrides: Partial<StudentProfileItem> = {},
): StudentProfileItem => ({
  id: studentId,
  nickname: "친구",
  inProgress: [
    {
      id: "33333333-3333-4333-8333-333333333333",
      purpose: "노트북",
      percent: 40,
      state: "IN_PROGRESS",
      startDate: null,
      targetDate: null,
    },
  ],
  finished: [],
  followingCount: 3,
  followerCount: 7,
  isFollowing: false,
  ...overrides,
});

const countOf = (label: string) =>
  screen.getByRole("link", { name: new RegExp(label) }).textContent;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("StudentProfile", () => {
  it("팔로우가 성공하면 팔로워 수를 하나 늘린다", async () => {
    followStudentAction.mockResolvedValue({ ok: true });
    render(<StudentProfile academyId={academyId} profile={profileOf()} />);

    fireEvent.click(screen.getByRole("button", { name: "팔로우" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "팔로잉" })).toBeVisible(),
    );
    expect(followStudentAction).toHaveBeenCalledWith(academyId, studentId);
    expect(countOf("팔로워")).toBe("팔로워8");
  });

  it("팔로우가 실패하면 상태를 그대로 두고 실패 문구를 띄운다", async () => {
    followStudentAction.mockResolvedValue({
      ok: false,
      message: "지금은 찾을 수 없는 학생이에요.",
    });
    render(<StudentProfile academyId={academyId} profile={profileOf()} />);

    fireEvent.click(screen.getByRole("button", { name: "팔로우" }));

    await waitFor(() =>
      expect(screen.getByText("지금은 찾을 수 없는 학생이에요.")).toBeVisible(),
    );
    expect(screen.getByRole("button", { name: "팔로우" })).toBeVisible();
    expect(countOf("팔로워")).toBe("팔로워7");
  });

  it("차단이 성공하면 위시를 감추고 팔로우를 끊는다", async () => {
    blockStudentAction.mockResolvedValue({ ok: true });
    render(
      <StudentProfile
        academyId={academyId}
        profile={profileOf({ isFollowing: true })}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "더보기" }));
    fireEvent.click(screen.getByRole("button", { name: "차단하기" }));

    await waitFor(() =>
      expect(screen.getByText("친구를 차단했어요.")).toBeVisible(),
    );
    expect(blockStudentAction).toHaveBeenCalledWith(studentId);
    expect(screen.getByText("진행중").parentElement).toHaveTextContent(
      "진행중0",
    );
    fireEvent.click(screen.getByRole("button", { name: "더보기" }));
    expect(screen.getByRole("button", { name: "해제하기" })).toBeVisible();
    expect(screen.getByRole("button", { name: "팔로우" })).toBeVisible();
    expect(countOf("팔로워")).toBe("팔로워6");
  });

  it("차단이 실패하면 차단 상태로 바꾸지 않는다", async () => {
    blockStudentAction.mockResolvedValue({
      ok: false,
      message: "잠시 후 다시 시도해주세요.",
    });
    render(<StudentProfile academyId={academyId} profile={profileOf()} />);

    fireEvent.click(screen.getByRole("button", { name: "더보기" }));
    fireEvent.click(screen.getByRole("button", { name: "차단하기" }));

    await waitFor(() =>
      expect(screen.getByText("잠시 후 다시 시도해주세요.")).toBeVisible(),
    );
    expect(screen.queryByRole("button", { name: "해제하기" })).toBeNull();
  });

  it("차단만 걸린 채로 들어와 해제하면 프로필을 다시 읽게 한다", async () => {
    unblockStudentAction.mockResolvedValue({ ok: true });
    const onUnblocked = vi.fn();
    render(
      <StudentProfile
        academyId={academyId}
        profile={profileOf({ inProgress: [] })}
        isBlocked
        onUnblocked={onUnblocked}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "더보기" }));
    fireEvent.click(screen.getByRole("button", { name: "해제하기" }));

    await waitFor(() => expect(onUnblocked).toHaveBeenCalledOnce());
    expect(unblockStudentAction).toHaveBeenCalledWith(studentId);
  });
});
