import { beforeEach, describe, expect, it, vi } from "vitest";

const listMyCardBalanceAccounts = vi.fn();
const listWishes = vi.fn();
const getMonthlyRecap = vi.fn();

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers(),
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
vi.mock("@/lib/http/recaps", () => ({
  getMonthlyRecap: (...args: unknown[]) => getMonthlyRecap(...args),
}));

const { listRecapYears } = await import("./recap-years");

const accountId = "11111111-1111-4111-8111-111111111111";

function recap(month: string, status: string) {
  return {
    ok: true,
    data: {
      kind: "MONTHLY",
      status,
      period: {
        startDate: `${month}-01`,
        endDateExclusive: `${month}-28`,
        timezone: "Asia/Seoul",
      },
      schemaVersion: 1,
      algorithmVersion: null,
      generationVersion: null,
      generatedAt: null,
      result: null,
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.setSystemTime(new Date("2026-09-10T00:00:00Z"));
  listMyCardBalanceAccounts.mockResolvedValue({
    ok: true,
    data: {
      items: [{ cardBalanceAccountId: accountId, unresolvedShortage: 0 }],
      nextCursor: null,
    },
  });
});

describe("리캡이 있는 연도 조회", () => {
  it("완성된 리캡이 있는 해만 오래된 순으로 준다", async () => {
    listWishes.mockResolvedValue({
      ok: true,
      data: {
        items: [{ createdAt: "2025-11-02T00:00:00Z" }],
        nextCursor: null,
      },
    });
    getMonthlyRecap.mockImplementation((_client, { month }) =>
      Promise.resolve(
        recap(
          month,
          ["2025-12", "2026-03", "2026-08"].includes(month)
            ? "SUCCEEDED"
            : "NOT_GENERATED",
        ),
      ),
    );

    await expect(listRecapYears()).resolves.toEqual([2025, 2026]);
  });

  it("가장 오래된 위시가 생긴 달부터 마지막 완료 월까지만 조회한다", async () => {
    listWishes.mockResolvedValue({
      ok: true,
      data: {
        items: [{ createdAt: "2026-06-15T00:00:00Z" }],
        nextCursor: null,
      },
    });
    getMonthlyRecap.mockImplementation((_client, { month }) =>
      Promise.resolve(recap(month, "NOT_GENERATED")),
    );

    await listRecapYears();

    expect(
      getMonthlyRecap.mock.calls.map(([, options]) => options.month),
    ).toEqual(["2026-06", "2026-07", "2026-08"]);
  });

  it("완성된 리캡이 없으면 빈 목록이다", async () => {
    listWishes.mockResolvedValue({
      ok: true,
      data: {
        items: [{ createdAt: "2026-07-01T00:00:00Z" }],
        nextCursor: null,
      },
    });
    getMonthlyRecap.mockImplementation((_client, { month }) =>
      Promise.resolve(recap(month, "NOT_ELIGIBLE")),
    );

    await expect(listRecapYears()).resolves.toEqual([]);
  });

  it("위시가 없으면 조회하지 않는다", async () => {
    listWishes.mockResolvedValue({
      ok: true,
      data: { items: [], nextCursor: null },
    });

    await expect(listRecapYears()).resolves.toEqual([]);
    expect(getMonthlyRecap).not.toHaveBeenCalled();
  });
});
