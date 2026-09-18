import { beforeEach, expect, it, vi } from "vitest";
import type { components } from "@/lib/http/generated/crabit-backend";

const state = vi.hoisted(() => ({
  accountId: "grade-4-account",
  name: "4학년 대표",
  list: vi.fn(),
  follows: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/app/wishes/load-account", () => ({
  loadAccountContext: async () => ({
    client: {},
    cardBalanceAccountId: state.accountId,
    account: { academyId: "academy" },
  }),
}));
vi.mock("@/lib/http/wishes", () => ({
  listWishes: (...args: unknown[]) => state.list(...args),
}));
vi.mock("@/lib/http/follows", () => ({
  listAcademyFollowing: (...args: unknown[]) => state.follows(...args),
}));
vi.mock("@/lib/persona/display-name-server", () => ({
  readPersonaDisplayName: async () => state.name,
}));

import { loadMyProfile } from "./load-my-profile";
import { toOwnedProfileWishes } from "./owned-profile-wishes";

type Wish = components["schemas"]["Wish"];
function wish(id: string, overrides: Partial<Wish> = {}): Wish {
  return {
    id,
    cardBalanceAccountId: state.accountId,
    purpose: id,
    amount: 2500,
    targetAmount: 10000,
    state: "IN_PROGRESS",
    visibility: "ACADEMY",
    abandonmentAmount: null,
    photo: null,
    version: 0,
    startDate: "2026-09-01",
    targetDate: null,
    createdAt: "2026-09-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
    completedAt: null,
    closedAt: null,
    actualDurationSeconds: null,
    balanceAdjustmentInProgress: false,
    ...overrides,
  };
}
const page = (items: Wish[], nextCursor: string | null = null) => ({
  ok: true,
  data: { items, nextCursor },
});

beforeEach(() => {
  vi.clearAllMocks();
  state.accountId = "grade-4-account";
  state.name = "4학년 대표";
  state.follows.mockResolvedValue({
    ok: true,
    data: { followingCount: 3, followerCount: 4 },
  });
});

it("uses the selected account on every request, including switching back to Owner", async () => {
  state.list.mockImplementation(async (_client, args) =>
    page([wish(args.cardBalanceAccountId)]),
  );
  for (const [accountId, name] of [
    ["grade-4-account", "4학년 대표"],
    ["owner-account", "나"],
    ["grade-3-account", "3학년 대표"],
  ]) {
    state.accountId = accountId;
    state.name = name;
    const view = await loadMyProfile();
    expect(view.nickname).toBe(name);
    expect(view.inProgress.map((x) => x.id)).toEqual([accountId]);
    expect(view.followingCount).toBe(3);
    expect(state.list).toHaveBeenLastCalledWith(
      {},
      { cardBalanceAccountId: accountId, limit: 100 },
    );
  }
});

it("reads later pages and excludes private wishes from profile counts", async () => {
  state.list
    .mockResolvedValueOnce(
      page(
        [wish("private", { visibility: "PRIVATE" }), wish("public")],
        "page2",
      ),
    )
    .mockResolvedValueOnce(
      page([wish("followers", { visibility: "FOLLOWERS" })]),
    );
  const view = await loadMyProfile();
  expect(view.inProgress.map((x) => x.id).sort()).toEqual([
    "followers",
    "public",
  ]);
  expect(state.list).toHaveBeenLastCalledWith(
    {},
    { cardBalanceAccountId: state.accountId, limit: 100, cursor: "page2" },
  );
});

it("preserves completed and abandoned progress after their money is returned", () => {
  const view = toOwnedProfileWishes([
    wish("completed", { state: "COMPLETED", amount: 0 }),
    wish("abandoned", {
      state: "ABANDONED",
      amount: 0,
      abandonmentAmount: 4700,
    }),
    wish("reached", { state: "AMOUNT_REACHED", amount: 10000 }),
  ]);
  expect(view.finished.find((x) => x.id === "completed")?.percent).toBe(100);
  expect(view.finished.find((x) => x.id === "abandoned")?.percent).toBe(47);
  expect(view.inProgress.find((x) => x.id === "reached")?.percent).toBe(100);
});

it("does not show a partial list when a later page fails", async () => {
  state.list
    .mockResolvedValueOnce(page([wish("first")], "next"))
    .mockResolvedValueOnce({ ok: false, error: { message: "unavailable" } });
  await expect(loadMyProfile()).rejects.toThrow("unavailable");
});

it("fails instead of looping on repeated cursors", async () => {
  state.list.mockResolvedValue(page([wish("first")], "repeat"));
  await expect(loadMyProfile()).rejects.toThrow("Repeated wish cursor");
  expect(state.list).toHaveBeenCalledTimes(2);
});

it("does not invent zero relationship counts on an API failure", async () => {
  state.list.mockResolvedValue(page([]));
  state.follows.mockResolvedValue({
    ok: false,
    error: { message: "relationships unavailable" },
  });
  await expect(loadMyProfile()).rejects.toThrow("relationships unavailable");
});

it("does not silently truncate when the pagination limit is exceeded", async () => {
  state.list.mockImplementation(async () =>
    page([wish("entry")], `page-${state.list.mock.calls.length}`),
  );
  await expect(loadMyProfile()).rejects.toThrow(
    "Wish pagination limit exceeded",
  );
  expect(state.list).toHaveBeenCalledTimes(20);
});

it("deduplicates a wish returned on two pages", async () => {
  state.list
    .mockResolvedValueOnce(page([wish("same")], "next"))
    .mockResolvedValueOnce(page([wish("same")]));
  expect((await loadMyProfile()).inProgress).toHaveLength(1);
});

it("preserves signed photo variants for the profile card", () => {
  const variants = {
    small: "https://example.com/s",
    medium: "https://example.com/m",
    large: "https://example.com/l",
  };
  const photo = { variants } as NonNullable<Wish["photo"]>;
  expect(
    toOwnedProfileWishes([wish("photo", { photo })]).inProgress[0]?.photo,
  ).toEqual(variants);
});
