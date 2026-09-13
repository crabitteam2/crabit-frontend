import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ status: "SUCCEEDED", name: "4학년 대표" }));
vi.mock("@/lib/persona/display-name-server", () => ({
  readPersonaDisplayName: async () => state.name,
}));
vi.mock("../load-recap", () => ({
  loadMonthlyRecap: async () => ({
    cardBalanceAccountId: "selected-account",
    recap: {
      status: state.status,
      period: { startDate: "2026-08-01" },
      result:
        state.status === "SUCCEEDED"
          ? {
              typeSection: { typeTitle: "꾸준형", message: "실제 응답 문구" },
              objectivePerformance: {},
              patternAnalysis: {},
              groupComparison: {},
              pacePrediction: {},
            }
          : null,
    },
  }),
}));
vi.mock("../_components/monthly-recap-screen", () => ({
  MonthlyRecapScreen: ({ intro }: { intro: string }) => <p>{intro}</p>,
}));
vi.mock("../_components/monthly-recap-empty", () => ({
  MonthlyRecapEmpty: ({ message }: { message: string }) => <p>{message}</p>,
}));
import MonthlyRecapPage from "./page";

afterEach(cleanup);
it("renders the selected representative and updates it after a switch", async () => {
  state.status = "SUCCEEDED";
  for (const grade of [4, 5]) {
    state.name = `${grade}학년 대표`;
    render(
      await MonthlyRecapPage({
        searchParams: Promise.resolve({ month: "2026-08" }),
      }),
    );
    expect(screen.getByText(`8월의 ${grade}학년 대표는`)).toBeVisible();
    expect(screen.queryByText(/아라/)).toBeNull();
    cleanup();
  }
});
it("renders terminal NOT_ELIGIBLE as insufficient savings rather than pending", async () => {
  state.status = "NOT_ELIGIBLE";
  render(
    await MonthlyRecapPage({
      searchParams: Promise.resolve({ month: "2026-08" }),
    }),
  );
  expect(screen.getByText(/유효한 저축이 3건 미만/)).toBeVisible();
  expect(screen.queryByText(/아직|9월 초/)).toBeNull();
});
