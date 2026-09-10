import createClient from "openapi-fetch";
import { describe, expect, it } from "vitest";
import type { paths } from "./generated/crabit-backend";
import { getMonthlyRecap, getWeeklyRecap } from "./recaps";

const accountId = "11111111-1111-4111-8111-111111111111";

describe("recap typed request helpers", () => {
  it("requests the latest weekly recap when no period is supplied", async () => {
    const requests: Request[] = [];
    const response = recap("WEEKLY", "NOT_GENERATED", "2026-08-24", "2026-08-31");
    const client = createClient<paths>({
      baseUrl: "https://backend.test",
      fetch: async (request) => {
        requests.push(request);
        return jsonResponse(200, response);
      },
    });

    await expect(getWeeklyRecap(client, { cardBalanceAccountId: accountId }))
      .resolves.toEqual({ ok: true, data: response });
    expect(requests[0]?.url).toBe(
      `https://backend.test/v1/card-balance-accounts/${accountId}/recaps/weekly`,
    );
  });

  it("passes explicit weekly and monthly periods without inventing dates", async () => {
    const urls: string[] = [];
    const client = createClient<paths>({
      baseUrl: "https://backend.test",
      fetch: async (request) => {
        urls.push(request.url);
        const monthly = request.url.includes("/monthly");
        return jsonResponse(
          200,
          monthly
            ? recap("MONTHLY", "NOT_ELIGIBLE", "2026-08-01", "2026-09-01", 1)
            : recap("WEEKLY", "GENERATING", "2026-08-24", "2026-08-31", 1),
        );
      },
    });

    await getWeeklyRecap(client, {
      cardBalanceAccountId: accountId,
      weekStart: "2026-08-24",
    });
    await getMonthlyRecap(client, {
      cardBalanceAccountId: accountId,
      month: "2026-08",
    });

    expect(urls).toEqual([
      `https://backend.test/v1/card-balance-accounts/${accountId}/recaps/weekly?weekStart=2026-08-24`,
      `https://backend.test/v1/card-balance-accounts/${accountId}/recaps/monthly?month=2026-08`,
    ]);
  });

  it("keeps storage failures as normalized retryable backend errors", async () => {
    const client = createClient<paths>({
      baseUrl: "https://backend.test",
      fetch: async () =>
        jsonResponse(503, {
          error: {
            code: "RECAP_QUERY_UNAVAILABLE",
            message: "잠시 후 다시 시도해 주세요.",
            retryable: true,
            traceId: "trace-recap",
            fieldErrors: [],
            details: {},
          },
        }),
    });

    await expect(getMonthlyRecap(client, { cardBalanceAccountId: accountId }))
      .resolves.toMatchObject({
        ok: false,
        error: {
          kind: "backend",
          status: 503,
          code: "RECAP_QUERY_UNAVAILABLE",
          retryable: true,
        },
      });
  });
});

function recap(
  kind: "WEEKLY" | "MONTHLY",
  status: "NOT_GENERATED" | "GENERATING" | "NOT_ELIGIBLE",
  startDate: string,
  endDateExclusive: string,
  generationVersion: number | null = null,
) {
  return {
    kind,
    status,
    period: { startDate, endDateExclusive, timezone: "Asia/Seoul" },
    generationVersion,
    schemaVersion: 1,
    algorithmVersion: generationVersion === null ? null : "recap-1",
    generatedAt: status === "NOT_ELIGIBLE" ? "2026-09-01T00:10:00Z" : null,
    result: null,
  } as const;
}

function jsonResponse(status: number, value: unknown) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
