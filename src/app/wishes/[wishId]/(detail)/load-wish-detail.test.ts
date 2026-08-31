import { beforeEach, describe, expect, it, vi } from "vitest";
import type { components } from "@/lib/http/generated/crabit-backend";

const listMyCardBalanceAccounts = vi.fn();
const getWish = vi.fn();
const listWishFundMovements = vi.fn();

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
  getWish: (...args: unknown[]) => getWish(...args),
  listWishFundMovements: (...args: unknown[]) => listWishFundMovements(...args),
}));

const { loadWishDetail } = await import("./load-wish-detail");

const accountId = "11111111-1111-4111-8111-111111111111";
const wishId = "22222222-2222-4222-8222-222222222222";

function wish(
  state: components["schemas"]["WishState"],
  abandonmentAmount: number | null,
): components["schemas"]["Wish"] {
  return {
    id: wishId,
    cardBalanceAccountId: accountId,
    purpose: "놀이공원 자유이용권",
    targetAmount: 50_000,
    amount: state === "ABANDONED" ? 0 : 12_000,
    abandonmentAmount,
    targetDate: "2026-10-31",
    state,
    visibility: "PRIVATE",
    balanceAdjustmentInProgress: false,
    createdAt: "2026-08-16T00:00:00Z",
    updatedAt: "2026-08-20T00:00:00Z",
    completedAt: state === "COMPLETED" ? "2026-08-20T00:00:00Z" : null,
    closedAt:
      state === "COMPLETED" || state === "ABANDONED"
        ? "2026-08-20T00:00:00Z"
        : null,
    actualDurationSeconds: state === "COMPLETED" ? 345_600 : null,
    version: 2,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  listMyCardBalanceAccounts.mockResolvedValue({
    ok: true,
    data: {
      items: [{ cardBalanceAccountId: accountId }],
      nextCursor: null,
    },
  });
  listWishFundMovements.mockResolvedValue({
    ok: true,
    data: { items: [], nextCursor: null },
  });
});

describe("위시 상세 화면 데이터 조회", () => {
  it("포기 직전 역사 금액을 현재 금액과 분리해 화면 모델로 옮긴다", async () => {
    getWish.mockResolvedValue({ ok: true, data: wish("ABANDONED", 12_000) });

    await expect(loadWishDetail(wishId)).resolves.toMatchObject({
      wish: {
        amount: 0,
        abandonmentAmount: 12_000,
        state: "ABANDONED",
      },
    });
  });

  it("0원 포기도 유효한 역사 값으로 보존한다", async () => {
    getWish.mockResolvedValue({ ok: true, data: wish("ABANDONED", 0) });

    await expect(loadWishDetail(wishId)).resolves.toMatchObject({
      wish: { amount: 0, abandonmentAmount: 0 },
    });
  });

  it("포기 위시의 역사 금액이 null이면 계약 오류로 실패한다", async () => {
    getWish.mockResolvedValue({ ok: true, data: wish("ABANDONED", null) });

    await expect(loadWishDetail(wishId)).rejects.toThrow(
      "ABANDONED Wish must have a valid abandonmentAmount",
    );
  });

  it("포기하지 않은 위시의 역사 금액이 있으면 계약 오류로 실패한다", async () => {
    getWish.mockResolvedValue({ ok: true, data: wish("COMPLETED", 12_000) });

    await expect(loadWishDetail(wishId)).rejects.toThrow(
      "Active or completed Wish must not have abandonmentAmount",
    );
  });
});
