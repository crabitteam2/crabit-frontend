import { expect, it, vi } from "vitest";
import Page from "./page";
import DonePage from "../done/page";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ useRouter: () => ({}) }));
vi.mock("../../fund-flow", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../fund-flow")>();
  return {
    ...actual,
    loadFundFlow: async () => ({
      card: { availableBalance: 10000 },
      wish: {
        id: "w1",
        amount: 5000,
        targetAmount: 10000,
        version: 3,
        purpose: "선물",
      },
      others: [
        {
          id: "w2",
          amount: 9000,
          targetAmount: 10000,
          version: 4,
          purpose: "여행",
        },
      ],
    }),
  };
});
it.each([
  { to: "card", amount: "1e3" },
  { to: "card", amount: ["100", "200"] },
  { to: ["card", "w2"], amount: "100" },
  { to: "w1", amount: "100" },
  { to: "missing", amount: "100" },
  { amount: "100" },
])(
  "rejects invalid withdrawal input before invoking a mutation: %j",
  async (query) => {
    const page = await Page({
      params: Promise.resolve({ wishId: "w1" }),
      searchParams: Promise.resolve(query),
    });
    expect(page.type).toBe(FormQueryError);
  },
);
it("passes both versions and the selected destination to the transfer screen", async () => {
  const page = await Page({
    params: Promise.resolve({ wishId: "w1" }),
    searchParams: Promise.resolve({ to: "w2", amount: "1000" }),
  });
  expect(page.props).toMatchObject({
    amount: 1000,
    expectedVersion: 3,
    destination: { kind: "wish", wishId: "w2", version: 4 },
  });
});
it("shows the server balance after withdrawal without subtracting twice", async () => {
  const page = await DonePage({
    params: Promise.resolve({ wishId: "w1" }),
    searchParams: Promise.resolve({ to: "card", amount: "10000" }),
  });
  expect(page.props).toMatchObject({ amount: 10000, balanceAfter: 5000 });
});
