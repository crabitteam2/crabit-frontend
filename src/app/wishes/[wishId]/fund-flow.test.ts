import { beforeEach, describe, expect, it, vi } from "vitest";

const listMyCardBalanceAccounts = vi.fn();
const listWishes = vi.fn();
const getWish = vi.fn();

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
  getWish: (...args: unknown[]) => getWish(...args),
}));

const { CARD_COUNTERPART_ID, findCounterpart, loadFundFlow, parseAmount } =
  await import("./fund-flow");

const accountId = "11111111-1111-4111-8111-111111111111";
const wishId = "22222222-2222-4222-8222-222222222222";
const otherWishId = "33333333-3333-4333-8333-333333333333";

const wish = (id: string, state: string, amount = 1_000) => ({
  id,
  purpose: `위시 ${id}`,
  amount,
  abandonmentAmount: state === "ABANDONED" ? amount : null,
  targetAmount: 10_000,
  state,
  version: 2,
});

function account(displayAvailableBalance: number | null) {
  return {
    ok: true,
    data: {
      items: [
        {
          cardBalanceAccountId: accountId,
          balanceKnowledge:
            displayAvailableBalance === null ? "UNKNOWN" : "KNOWN",
          displayAvailableBalance,
        },
      ],
      nextCursor: null,
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  listMyCardBalanceAccounts.mockResolvedValue(account(20_000));
  getWish.mockResolvedValue({ ok: true, data: wish(wishId, "IN_PROGRESS") });
  listWishes.mockResolvedValue({
    ok: true,
    data: {
      items: [
        wish(wishId, "IN_PROGRESS"),
        wish(otherWishId, "IN_PROGRESS"),
        wish("44444444-4444-4444-8444-444444444444", "COMPLETED"),
      ],
      nextCursor: null,
    },
  });
});

describe("돈 넣기와 돈 꺼내기 화면 데이터 조회", () => {
  it("자기 자신과 종료된 위시를 상대 목록에서 뺀다", async () => {
    const view = await loadFundFlow(wishId);

    expect(view?.wish.id).toBe(wishId);
    expect(view?.others.map((item) => item.id)).toEqual([otherWishId]);
  });

  it("잔액을 모르는 계좌는 카드 잔액을 null로 넘긴다", async () => {
    listMyCardBalanceAccounts.mockResolvedValue(account(null));

    const view = await loadFundFlow(wishId);

    expect(view?.card.availableBalance).toBeNull();
  });

  it("없는 위시면 null을 돌려준다", async () => {
    getWish.mockResolvedValue({
      ok: false,
      error: { kind: "backend", status: 404, code: "WISH_NOT_FOUND" },
    });

    await expect(loadFundFlow(wishId)).resolves.toBeNull();
  });

  it("상대 식별자를 카드 잔액이나 다른 위시로 옮긴다", async () => {
    const view = await loadFundFlow(wishId);
    if (view === null) throw new Error("view must not be null");

    expect(findCounterpart(view, CARD_COUNTERPART_ID)?.kind).toBe("card");
    expect(findCounterpart(view, otherWishId)?.kind).toBe("wish");
    expect(findCounterpart(view, wishId)).toBeNull();
    expect(findCounterpart(view, undefined)).toBeNull();
  });
});

describe("금액 쿼리 읽기", () => {
  it.each([
    ["5000", 5_000],
    ["0", 0],
    ["-1", 0],
    ["1.5", 0],
    ["abc", 0],
    [undefined, 0],
  ])("%s는 %s로 읽는다", (raw, expected) => {
    expect(parseAmount(raw)).toBe(expected);
  });

  it("배열로 오면 첫 값만 쓴다", () => {
    expect(parseAmount(["3000", "9000"])).toBe(3_000);
  });
});
