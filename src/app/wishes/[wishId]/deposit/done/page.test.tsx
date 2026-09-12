import { expect, it, vi } from "vitest";
import AmountPage from "../amount/page";
import CoinPage from "../coin/page";
import DonePage from "./page";
import { AmountForm } from "@/app/wishes/_components/amount-form";

vi.mock("server-only", () => ({}));
vi.mock("../../fund-flow", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../fund-flow")>();
  return {
    ...actual,
    loadFundFlow: async () => ({
      card: { availableBalance: 10000 },
      wish: {
        id: "w4",
        targetAmount: 10000,
        amount: 5000,
        version: 2,
        state: "IN_PROGRESS",
      },
      others: [{ id: "w2", amount: 10000, targetAmount: 20000, version: 1 }],
    }),
  };
});
const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({}), redirect }));
vi.mock("../../../fund-receipt", () => ({
  loadFundReceipt: async (_wishId: string, eventId?: string) =>
    eventId === "e1" ? { amount: 1500, balanceAfter: 6500 } : null,
}));

it("sends missing or invalid deposit sources back to the card step", async () => {
  for (const from of [undefined, "", "missing", "w4", ["w2", "w3"]]) {
    await expect(
      CoinPage({
        params: Promise.resolve({ wishId: "w4" }),
        searchParams: Promise.resolve({ from }),
      }),
      `from=${JSON.stringify(from)}`,
    ).rejects.toThrow("NEXT_REDIRECT:/wishes/w4/deposit");
  }
});

it("hands the preserved source and its ticket to the coin screen", async () => {
  const page = await CoinPage({
    params: Promise.resolve({ wishId: "w4" }),
    searchParams: Promise.resolve({ from: "w2" }),
  });
  expect(page.props).toMatchObject({
    source: { kind: "wish", wishId: "w2", version: 1 },
    ticketName: "deposit:w4:w2",
    amountHref: "/wishes/w4/deposit/amount?from=w2",
  });
});

it("keeps the default card for direct entry into the amount step", async () => {
  const page = await AmountPage({
    params: Promise.resolve({ wishId: "w4" }),
    searchParams: Promise.resolve({}),
  });
  expect(page.type).toBe(AmountForm);
  expect(page.props).toMatchObject({
    nextParams: { from: "card" },
    ticketName: "deposit:w4:card",
  });
});

it("shows the recorded movement on the completion screen", async () => {
  const page = await DonePage({
    params: Promise.resolve({ wishId: "w4" }),
    searchParams: Promise.resolve({ event: "e1" }),
  });
  expect(page.props.amount).toBe(1500);
});

it("sends the completion screen back when no movement matches", async () => {
  await expect(
    DonePage({
      params: Promise.resolve({ wishId: "w4" }),
      searchParams: Promise.resolve({ amount: "10000", from: "card" }),
    }),
  ).rejects.toThrow("NEXT_REDIRECT:/wishes/w4");
  expect(redirect).toHaveBeenCalledWith("/wishes/w4");
});
