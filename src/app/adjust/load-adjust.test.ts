import { beforeEach, describe, expect, it, vi } from "vitest";

const listMyCardBalanceAccounts = vi.fn();
const listWishes = vi.fn();

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
}));

const { loadAdjust } = await import("./load-adjust");

const accountId = "11111111-1111-4111-8111-111111111111";

const wish = (id: string, state: string, amount: number) => ({
  id,
  purpose: `위시 ${id}`,
  amount,
  abandonmentAmount: state === "ABANDONED" ? amount : null,
  targetAmount: 100_000,
  state,
  version: 1,
});

function account(unresolvedShortage: number | null) {
  return {
    ok: true,
    data: {
      items: [
        {
          cardBalanceAccountId: accountId,
          unresolvedShortage,
          displayAvailableBalance: unresolvedShortage === null ? null : 0,
        },
      ],
      nextCursor: null,
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  listMyCardBalanceAccounts.mockResolvedValue(account(50_000));
  listWishes.mockResolvedValue({
    ok: true,
    data: {
      items: [
        wish("w1", "IN_PROGRESS", 30_000),
        wish("w2", "IN_PROGRESS", 0),
        wish("w3", "COMPLETED", 20_000),
        wish("w4", "AMOUNT_REACHED", 100_000),
      ],
      nextCursor: null,
    },
  });
});

describe("잔액 조정 화면 데이터 조회", () => {
  it("돈이 들어 있는 활성 위시만 넘긴다", async () => {
    const view = await loadAdjust("아라");

    expect(view?.wishes.map((item) => item.id)).toEqual(["w1", "w4"]);
  });

  it("부족액과 카드 이름을 넘긴다", async () => {
    const view = await loadAdjust("아라");

    expect(view?.card).toMatchObject({
      label: "아라의 크래빗 카드",
      shortage: 50_000,
    });
  });

  it("부족액이 없으면 null이다", async () => {
    listMyCardBalanceAccounts.mockResolvedValue(account(0));

    await expect(loadAdjust("아라")).resolves.toBeNull();
  });

  it("잔액을 조회하지 못한 계좌도 null이다", async () => {
    listMyCardBalanceAccounts.mockResolvedValue(account(null));

    await expect(loadAdjust("아라")).resolves.toBeNull();
  });
});
