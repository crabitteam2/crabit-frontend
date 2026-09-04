import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => (
    // oxlint-disable-next-line next/no-img-element -- The test mock does not need Next image handling.
    <img alt={alt} />
  ),
}));

const listAcademyStudentFollowing = vi.fn();
const listAcademyStudentFollowers = vi.fn();
const followAcademyStudent = vi.fn();
const unfollowAcademyStudent = vi.fn();

vi.mock("@/lib/http/browser", () => ({
  createBrowserApiClient: () => ({ client: "browser-bff" }),
}));
vi.mock("@/lib/http/follows", () => ({
  listAcademyStudentFollowing: (...args: unknown[]) =>
    listAcademyStudentFollowing(...args),
  listAcademyStudentFollowers: (...args: unknown[]) =>
    listAcademyStudentFollowers(...args),
  followAcademyStudent: (...args: unknown[]) => followAcademyStudent(...args),
  unfollowAcademyStudent: (...args: unknown[]) =>
    unfollowAcademyStudent(...args),
}));

import { FollowListScreen } from "./follow-list-screen";

const academyId = "11111111-1111-4111-8111-111111111111";
const ownerStudentId = "22222222-2222-4222-8222-222222222222";
const listedStudentId = "33333333-3333-4333-8333-333333333333";

const page = (nickname = "민지", isFollowing = false) => ({
  items: [
    {
      studentId: listedStudentId,
      nickname,
      followedAt: "2026-09-04T00:00:00Z",
      isFollowing,
      isFollowedBy: false,
    },
  ],
  nextCursor: null,
  followingCount: 7,
  followerCount: 50,
});

function renderRemote(options: Partial<React.ComponentProps<typeof FollowListScreen>> = {}) {
  return render(
    <FollowListScreen
      backHref={`/feed/${ownerStudentId}?academyId=${academyId}`}
      followingHref={`/feed/${ownerStudentId}/follows?academyId=${academyId}`}
      followersHref={`/feed/${ownerStudentId}/follows?academyId=${academyId}&tab=followers`}
      tab="following"
      academyId={academyId}
      ownerStudentId={ownerStudentId}
      initialPage={page()}
      {...options}
    />,
  );
}

describe("FollowListScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listAcademyStudentFollowing.mockResolvedValue({ ok: true, data: page() });
    listAcademyStudentFollowers.mockResolvedValue({ ok: true, data: page() });
    followAcademyStudent.mockResolvedValue({ ok: true, data: undefined });
    unfollowAcademyStudent.mockResolvedValue({ ok: true, data: undefined });
  });

  it("uses an owner-addressed BFF request for remote nickname search", async () => {
    renderRemote();

    fireEvent.change(screen.getByRole("textbox", { name: "학생 검색" }), {
      target: { value: "민" },
    });

    await waitFor(() =>
      expect(listAcademyStudentFollowing).toHaveBeenCalledWith(
        { client: "browser-bff" },
        {
          academyId,
          studentId: ownerStudentId,
          cursor: undefined,
          nickname: "민",
        },
      ),
    );
    expect(screen.getByRole("link", { name: "팔로워" })).toHaveAttribute(
      "href",
      `/feed/${ownerStudentId}/follows?academyId=${academyId}&tab=followers`,
    );
  });

  it("prevents duplicate follow requests while the current mutation is pending", async () => {
    let resolveFollow!: (value: { ok: true; data: undefined }) => void;
    followAcademyStudent.mockReturnValue(new Promise((resolve) => {
      resolveFollow = resolve;
    }));
    renderRemote();

    const follow = screen.getByRole("button", { name: "팔로우" });
    fireEvent.click(follow);
    fireEvent.click(follow);

    expect(followAcademyStudent).toHaveBeenCalledTimes(1);
    expect(follow).toBeDisabled();
    resolveFollow({ ok: true, data: undefined });

    await waitFor(() => expect(listAcademyStudentFollowing).toHaveBeenCalledTimes(1));
  });

  it("does not explain why an owner-addressed list is unavailable", () => {
    renderRemote({ initialError: "unavailable", initialPage: undefined });

    expect(screen.getByRole("status")).toHaveTextContent("이 목록을 볼 수 없어요.");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
