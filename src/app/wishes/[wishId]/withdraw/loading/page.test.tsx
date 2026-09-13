import { expect, it, vi } from "vitest";
import Page from "./page";
import DonePage from "../done/page";
import { WithdrawLoadingScreen } from "@/app/wishes/_components/withdraw-loading-screen";
vi.mock("server-only", () => ({}));
const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({}), redirect }));
vi.mock("../../../fund-receipt", () => ({
  loadFundReceipt: async (_wishId: string, eventId?: string) =>
    eventId === "e1" ? { amount: 10000, balanceAfter: 5000 } : null,
}));
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
        state: "IN_PROGRESS",
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
it.each<Record<string, string | string[] | undefined>>([
  { to: ["card", "w2"] },
  { to: "w1" },
  { to: "missing" },
  {},
])("sends an unknown destination back to the card step: %j", async (query) => {
  await expect(
    Page({
      params: Promise.resolve({ wishId: "w1" }),
      searchParams: Promise.resolve(query),
    }),
  ).rejects.toThrow("NEXT_REDIRECT:/wishes/w1/withdraw");
});
it("hands the transfer and its ticket to the loading screen", async () => {
  const page = await Page({
    params: Promise.resolve({ wishId: "w1" }),
    searchParams: Promise.resolve({ to: "w2" }),
  });
  expect(page.type).toBe(WithdrawLoadingScreen);
  expect(page.props).toMatchObject({
    expectedVersion: 3,
    destination: { kind: "wish", wishId: "w2", version: 4 },
    ticketName: "withdraw:w1:w2",
    amountHref: "/wishes/w1/withdraw/amount?to=w2",
    doneHref: "/wishes/w1/withdraw/done?to=w2",
  });
});
it("shows the recorded movement instead of the address amount", async () => {
  const page = await DonePage({
    params: Promise.resolve({ wishId: "w1" }),
    searchParams: Promise.resolve({ to: "card", event: "e1" }),
  });
  expect(page.props).toMatchObject({ amount: 10000, balanceAfter: 5000 });
});
it("sends the completion screen back when no movement matches", async () => {
  await expect(
    DonePage({
      params: Promise.resolve({ wishId: "w1" }),
      searchParams: Promise.resolve({ to: "card", amount: "10000" }),
    }),
  ).rejects.toThrow("NEXT_REDIRECT:/wishes/w1");
  expect(redirect).toHaveBeenCalledWith("/wishes/w1");
});
