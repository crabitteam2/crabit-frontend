import type { components } from "./generated/crabit-backend";
import { apiResult, type ApiResult } from "./result";
import type { CrabitApiClient } from "./wishes";

export interface GetCardBalanceAccountOptions {
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
}

export function getCardBalanceAccount(
  client: CrabitApiClient,
  options: GetCardBalanceAccountOptions,
): Promise<ApiResult<components["schemas"]["CardBalanceAccount"]>> {
  return apiResult<components["schemas"]["CardBalanceAccount"]>(() => client.GET(
    "/v1/card-balance-accounts/{cardBalanceAccountId}",
    { params: { path: options } },
  ));
}
