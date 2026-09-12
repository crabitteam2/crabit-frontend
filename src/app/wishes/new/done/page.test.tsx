import { it, expect, vi } from "vitest";
import Page from "./page";
const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));
vi.mock("../../load-account", () => ({ loadAccountContext: vi.fn() }));
vi.mock("@/lib/http/wishes", () => ({ getWish: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({}), redirect }));
it("sends malformed direct links back to the first step", async () => {
  await expect(
    Page({
      searchParams: Promise.resolve({ purpose: "위시", targetAmount: "1e3" }),
    }),
  ).rejects.toThrow("NEXT_REDIRECT:/wishes/new");
});
