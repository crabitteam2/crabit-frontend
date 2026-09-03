import { StrictMode } from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ session: null as any, read: vi.fn() }));
vi.mock("./behavior-session", () => ({
  useBehaviorSession: () => state.session,
  behaviorRead: state.read,
}));
vi.mock("next/image", () => ({
  default: ({ priority: _priority, fill: _fill, ...props }: any) => (
    <span role="img" aria-label={props.alt} />
  ),
}));
import { RealProfile } from "./real-profile";
beforeEach(() => {
  state.session = {
    context: { contextId: "context", academyId: "academy" },
    entry: {
      eventId: "entry",
      occurredAt: "2026-09-02T00:00:00.000Z",
      submitted: false,
      queue: { offer: vi.fn() },
    },
  };
  state.read.mockReset();
});
afterEach(cleanup);
it("StrictMode and rerender produce one visit after exact student success even with no public cards", async () => {
  state.read.mockImplementation((_context, path) =>
    Promise.resolve(
      path.startsWith("students/")
        ? {
            studentId: "student",
            nickname: "학생",
            isFollowing: false,
            isFollowedBy: false,
          }
        : { items: [], nextCursor: null },
    ),
  );
  const view = render(
    <StrictMode>
      <RealProfile studentId="student" />
    </StrictMode>,
  );
  await screen.findByText("공유한 위시가 없어요.");
  view.rerender(
    <StrictMode>
      <RealProfile studentId="student" />
    </StrictMode>,
  );
  expect(state.session.entry.queue.offer).toHaveBeenCalledOnce();
  expect(state.session.entry.queue.offer).toHaveBeenCalledWith(
    "profile-visits",
    {
      eventId: "entry",
      occurredAt: "2026-09-02T00:00:00.000Z",
      targetStudentId: "student",
    },
  );
});
it("late target response after navigation cannot display or collect the previous student", async () => {
  let resolveOld!: (value: unknown) => void;
  state.read.mockImplementation((_context, path) =>
    path === "students/old"
      ? new Promise((resolve) => {
          resolveOld = resolve;
        })
      : Promise.reject(new Error("404")),
  );
  const view = render(<RealProfile studentId="old" />);
  view.rerender(<RealProfile studentId="new" />);
  resolveOld({ studentId: "old", nickname: "오래된 학생" });
  await waitFor(() => expect(screen.getByRole("alert")).toBeVisible());
  expect(screen.queryByText("오래된 학생")).toBeNull();
  expect(state.session.entry.queue.offer).not.toHaveBeenCalled();
});
