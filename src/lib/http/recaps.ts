import type { components } from "./generated/crabit-backend";
import { apiResult, type ApiResult } from "./result";
import type { CrabitApiClient } from "./wishes";

/** 주간 리캡 조회에 필요한 계좌와 선택 기간입니다. */
export interface GetWeeklyRecapOptions {
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  /** 조회할 완료 주의 월요일입니다. 생략하면 가장 최근 완료 주입니다. */
  readonly weekStart?: string;
}

/** 월간 리캡 조회에 필요한 계좌와 선택 기간입니다. */
export interface GetMonthlyRecapOptions {
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  /** 조회할 완료 월의 YYYY-MM 값입니다. 생략하면 가장 최근 완료 월입니다. */
  readonly month?: string;
}

/** 저장된 주간 리캡의 공개 상태와 결과를 조회합니다. */
export function getWeeklyRecap(
  client: CrabitApiClient,
  options: GetWeeklyRecapOptions,
): Promise<ApiResult<components["schemas"]["WeeklyRecapResponse"]>> {
  const { cardBalanceAccountId, weekStart } = options;
  return apiResult<components["schemas"]["WeeklyRecapResponse"]>(() =>
    client.GET(
      "/v1/card-balance-accounts/{cardBalanceAccountId}/recaps/weekly",
      {
        params: {
          path: { cardBalanceAccountId },
          query: weekStart === undefined ? {} : { weekStart },
        },
      },
    ),
  );
}

/** 저장된 월간 리캡의 공개 상태와 결과를 조회합니다. */
export function getMonthlyRecap(
  client: CrabitApiClient,
  options: GetMonthlyRecapOptions,
): Promise<ApiResult<components["schemas"]["MonthlyRecapResponse"]>> {
  const { cardBalanceAccountId, month } = options;
  return apiResult<components["schemas"]["MonthlyRecapResponse"]>(() =>
    client.GET(
      "/v1/card-balance-accounts/{cardBalanceAccountId}/recaps/monthly",
      {
        params: {
          path: { cardBalanceAccountId },
          query: month === undefined ? {} : { month },
        },
      },
    ),
  );
}
