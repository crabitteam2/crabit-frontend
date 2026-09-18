import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  search: vi.fn(),
  accountId: "grade-4",
  contextId: "context-4",
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
}));
vi.mock("next/image", () => ({ default: () => null }));
vi.mock("@/components/ui/confirm-dialog", () => ({
  ConfirmDialog: () => null,
}));
vi.mock("@/lib/http/browser", () => ({ createBrowserApiClient: () => ({}) }));
vi.mock("@/lib/http/follows", () => ({
  searchAcademyStudents: (...args: unknown[]) => state.search(...args),
}));
vi.mock("./behavior-session", () => ({
  useBehaviorSession: () => ({
    context: { academyId: "academy", contextId: state.contextId },
    accounts: [{ cardBalanceAccountId: state.accountId, academyId: "academy" }],
  }),
}));
import { FeedSearch } from "./feed-search";
import { saveRecentSearches } from "./recent-search-storage";

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  state.accountId = "grade-4";
  state.contextId = "context-4";
});

it("clearing a query rejects the already in-flight result", async () => {
  let finish!: (value: unknown) => void;
  state.search.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  render(<FeedSearch />);
  fireEvent.change(screen.getByRole("textbox", { name: "학생 검색" }), {
    target: { value: "늦은 검색" },
  });
  await waitFor(() => expect(state.search).toHaveBeenCalledTimes(1));
  fireEvent.change(screen.getByRole("textbox", { name: "학생 검색" }), {
    target: { value: "" },
  });
  await act(async () =>
    finish({
      ok: true,
      data: { items: [{ studentId: "other", nickname: "늦은 결과" }] },
    }),
  );
  expect(screen.queryByText("늦은 결과")).toBeNull();
});

it("switching accounts in the same academy replaces recent searches", async () => {
  saveRecentSearches(["4학년의 검색어"], "grade-4:academy");
  saveRecentSearches(["Owner의 검색어"], "owner:academy");
  const view = render(<FeedSearch />);
  expect(await screen.findByText("4학년의 검색어")).toBeInTheDocument();
  state.accountId = "owner";
  state.contextId = "owner-context";
  view.rerender(<FeedSearch />);
  expect(await screen.findByText("Owner의 검색어")).toBeInTheDocument();
  expect(screen.queryByText("4학년의 검색어")).toBeNull();
});
