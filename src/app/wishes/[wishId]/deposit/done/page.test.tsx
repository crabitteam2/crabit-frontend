import { expect, it, vi } from "vitest";
import AmountPage from "../amount/page";
import CoinPage from "../coin/page";
import DonePage from "./page";
import { AmountForm } from "@/app/wishes/_components/amount-form";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";

vi.mock("server-only", () => ({}));
vi.mock("../../fund-flow", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../fund-flow")>();
  return {
    ...actual,
    loadFundFlow: async () => ({
      card: { availableBalance: 10000 },
      wish: { id: "w4", targetAmount: 10000, amount: 5000, version: 2 },
      others: [{ id: "w2", amount: 10000, targetAmount: 20000, version: 1 }],
    }),
  };
});
vi.mock("next/navigation", () => ({ useRouter: () => ({}) }));

it.each([
  ["coin", CoinPage],
  ["done", DonePage],
] as const)(
  "rejects missing or invalid deposit sources at the %s boundary",
  async (_, Page) => {
    for (const from of [undefined, "", "missing", "w4", ["w2", "w3"]]) {
      const page = await Page({
        params: Promise.resolve({ wishId: "w4" }),
        searchParams: Promise.resolve({ amount: "1000", from }),
      });
      expect(page.type, `from=${JSON.stringify(from)}`).toBe(FormQueryError);
    }
  },
);

it.each([
  ["coin", CoinPage],
  ["done", DonePage],
] as const)(
  "accepts the preserved source at the %s boundary",
  async (_, Page) => {
    const page = await Page({
      params: Promise.resolve({ wishId: "w4" }),
      searchParams: Promise.resolve({ amount: "1500", from: "w2" }),
    });
    expect(page.type).not.toBe(FormQueryError);
    expect(page.props.amount).toBe(1500);
  },
);

it("keeps the default card for direct entry into the amount step", async () => {
  const page = await AmountPage({
    params: Promise.resolve({ wishId: "w4" }),
    searchParams: Promise.resolve({}),
  });
  expect(page.type).toBe(AmountForm);
  expect(page.props.nextParams).toEqual({ from: "card" });
});

it.each(["1e3", "-100", "0", "1.5", ["100", "200"], "5001"])(
  "blocks invalid or over-target deposits before the coin mutation: %s",
  async (amount) => {
    const page = await CoinPage({
      params: Promise.resolve({ wishId: "w4" }),
      searchParams: Promise.resolve({ from: "w2", amount }),
    });
    expect(page.type).toBe(FormQueryError);
  },
);

it("does not reapply pre-transaction balance limits on the completion screen", async () => {
  const page = await DonePage({
    params: Promise.resolve({ wishId: "w4" }),
    searchParams: Promise.resolve({ from: "card", amount: "10000" }),
  });
  expect(page.type).not.toBe(FormQueryError);
  expect(page.props.amount).toBe(10000);
});
