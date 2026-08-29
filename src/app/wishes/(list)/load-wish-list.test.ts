import { beforeEach, describe, expect, it, vi } from "vitest";

const listMyCardBalanceAccounts = vi.fn();
const listWishes = vi.fn();
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
  listWishes: (...args: unknown[]) => listWishes(...args),
  getRepresentativeWish: (...args: unknown[]) => getRepresentativeWish(...args),
}));

const { CardBalanceAccountMissingError, loadWishList } =
  await import("./load-wish-list");

const accountId = "11111111-1111-4111-8111-111111111111";

const wish = (id: string, state: string) => ({
  id,
  purpose: `위시 ${id}`,
  amount: 1_000,
  targetAmount: 10_000,
  state,
});

function accountPage(items: unknown[]) {
  return { ok: true, data: { items, nextCursor: null } };
}

beforeEach(() => {
  vi.clearAllMocks();
  listMyCardBalanceAccounts.mockResolvedValue(
    accountPage([{ cardBalanceAccountId: accountId }]),
  );
  getRepresentativeWish.mockResolvedValue({ ok: true, data: undefined });
});

describe("위시 목록 화면 데이터 조회", () => {
  it("진행중과 종료된 위시를 나누고 대표 위시를 맨 앞에 둔다", async () => {
    listWishes.mockResolvedValue({
      ok: true,
      data: {
        items: [
          wish("w1", "IN_PROGRESS"),
          wish("w2", "COMPLETED"),
          wish("w3", "AMOUNT_REACHED"),
          wish("w4", "ABANDONED"),
        ],
        nextCursor: null,
      },
    });
    getRepresentativeWish.mockResolvedValue({
      ok: true,
      data: wish("w3", "AMOUNT_REACHED"),
    });

    const view = await loadWishList();

    expect(view.inProgress.map((item) => item.id)).toEqual(["w3", "w1"]);
    expect(view.finished.map((item) => item.id)).toEqual(["w2", "w4"]);
    expect(view.representativeId).toBe("w3");
    expect(listWishes).toHaveBeenCalledWith(expect.anything(), {
      cardBalanceAccountId: accountId,
      limit: 100,
    });
  });

  it("대표 위시가 없으면 조회한 순서를 유지한다", async () => {
    listWishes.mockResolvedValue({
      ok: true,
      data: {
        items: [wish("w1", "IN_PROGRESS"), wish("w2", "IN_PROGRESS")],
        nextCursor: null,
      },
    });

    const view = await loadWishList();

    expect(view.inProgress.map((item) => item.id)).toEqual(["w1", "w2"]);
    expect(view.representativeId).toBeNull();
  });

  it("계좌를 하나도 받지 못하면 실패한다", async () => {
    listMyCardBalanceAccounts.mockResolvedValue(accountPage([]));

    await expect(loadWishList()).rejects.toBeInstanceOf(
      CardBalanceAccountMissingError,
    );
    expect(listWishes).not.toHaveBeenCalled();
  });

  it("위시 조회가 실패하면 오류를 그대로 던진다", async () => {
    listWishes.mockResolvedValue({
      ok: false,
      error: { kind: "network", code: "NETWORK_ERROR", message: "실패" },
    });

    await expect(loadWishList()).rejects.toThrow("실패");
  });
});
