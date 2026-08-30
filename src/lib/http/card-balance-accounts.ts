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
