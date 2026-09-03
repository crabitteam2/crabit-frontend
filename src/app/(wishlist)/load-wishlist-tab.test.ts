import { beforeEach, describe, expect, it, vi } from "vitest";

const listMyCardBalanceAccounts = vi.fn();
const getRepresentativeWish = vi.fn();

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ cookie: "crabit-e2e-persona=owner" }),
}));
vi.mock("@/lib/http/server", () => ({
  createServerApiClient: () => ({}),
}));
vi.mock("@/lib/http/card-balance-accounts", () => ({
  listMyCardBalanceAccounts: (...args: unknown[]) =>
    listMyCardBalanceAccounts(...args),
}));
vi.mock("@/lib/http/wishes", () => ({
  getRepresentativeWish: (...args: unknown[]) => getRepresentativeWish(...args),
}));

const { loadWishlistTab } = await import("./load-wishlist-tab");

const accountId = "11111111-1111-4111-8111-111111111111";

function account(unresolvedShortage: number | null) {
  return {
    ok: true,
    data: {
      items: [{ cardBalanceAccountId: accountId, unresolvedShortage }],
      nextCursor: null,
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  listMyCardBalanceAccounts.mockResolvedValue(account(0));
  getRepresentativeWish.mockResolvedValue({
    ok: true,
    data: {
      id: "22222222-2222-4222-8222-222222222222",
      purpose: "노트북",
      amount: 350_000,
      targetAmount: 1_500_000,
    },
  });
});

describe("위시리스트 탭 데이터 조회", () => {
  it("대표 위시의 이름과 금액을 넘긴다", async () => {
    await expect(loadWishlistTab()).resolves.toEqual({
      representativeWish: {
        purpose: "노트북",
        amount: 350_000,
        targetAmount: 1_500_000,
      },
      unresolvedShortage: 0,
    });
  });

  it("대표 위시를 고르지 않았으면 null이다", async () => {
    getRepresentativeWish.mockResolvedValue({ ok: true, data: undefined });

    await expect(loadWishlistTab()).resolves.toMatchObject({
      representativeWish: null,
    });
  });

  it("부족액을 그대로 넘긴다", async () => {
    listMyCardBalanceAccounts.mockResolvedValue(account(55_500));

    await expect(loadWishlistTab()).resolves.toMatchObject({
      unresolvedShortage: 55_500,
    });
  });

  it("잔액을 조회하지 못한 계좌의 부족액은 null이다", async () => {
    listMyCardBalanceAccounts.mockResolvedValue(account(null));

    await expect(loadWishlistTab()).resolves.toMatchObject({
      unresolvedShortage: null,
    });
  });
});
