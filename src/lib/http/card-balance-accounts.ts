import type { components } from "./generated/crabit-backend";
import { apiResult, type ApiResult } from "./result";
import type { CrabitApiClient } from "./wishes";

/** 인증된 학생이 볼 수 있는 카드잔액계좌 목록을 조회합니다. */
export function listMyCardBalanceAccounts(
  client: CrabitApiClient,
): Promise<ApiResult<components["schemas"]["CardBalanceAccountPage"]>> {
  return apiResult<components["schemas"]["CardBalanceAccountPage"]>(() =>
    client.GET("/v1/me/card-balance-accounts"),
  );
}

/** 카드잔액계좌 단건 조회에 필요한 경로 변수입니다. */
export interface GetCardBalanceAccountOptions {
  /** 조회할 카드잔액계좌 식별자입니다. */
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
}

/** 카드잔액계좌 하나를 조회하고 응답을 {@link ApiResult}로 정규화합니다. */
export function getCardBalanceAccount(
  client: CrabitApiClient,
  options: GetCardBalanceAccountOptions,
): Promise<ApiResult<components["schemas"]["CardBalanceAccount"]>> {
  return apiResult<components["schemas"]["CardBalanceAccount"]>(() =>
    client.GET("/v1/card-balance-accounts/{cardBalanceAccountId}", {
      params: { path: options },
    }),
  );
}

/** 카드 잔액 새로고침에 필요한 경로 변수입니다. */
export interface RefreshCardBalanceOptions {
  /** 잔액을 새로 조회할 카드잔액계좌 식별자입니다. */
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
}

/** 카드사에 현재 잔액을 다시 조회해 계좌 스냅샷을 갱신합니다. */
export function refreshCardBalance(
  client: CrabitApiClient,
  options: RefreshCardBalanceOptions,
): Promise<ApiResult<components["schemas"]["BalanceRefreshResult"]>> {
  return apiResult<components["schemas"]["BalanceRefreshResult"]>(() =>
    client.POST(
      "/v1/card-balance-accounts/{cardBalanceAccountId}/balance-refreshes",
      { params: { path: options } },
    ),
  );
}
