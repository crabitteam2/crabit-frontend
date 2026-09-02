import { it, expect, vi } from "vitest";
import Page from "./page";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
vi.mock("../../load-account", () => ({ loadAccountContext: vi.fn() }));
vi.mock("@/lib/http/wishes", () => ({ getWish: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({}) }));
it("does not render completion for malformed direct links", async () => {
  const page = await Page({
    searchParams: Promise.resolve({ purpose: "위시", targetAmount: "1e3" }),
  });
  expect(page.type).toBe(FormQueryError);
});
