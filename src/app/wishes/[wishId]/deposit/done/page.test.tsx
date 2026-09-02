import { expect, it, vi } from "vitest";
import AmountPage from "../amount/page";
import CoinPage from "../coin/page";
import DonePage from "./page";
import { AmountForm } from "@/app/wishes/_components/amount-form";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";

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
  expect(page.props.from).toBe("a1");
});
