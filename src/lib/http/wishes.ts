import type { Client } from "openapi-fetch";
import type {
  components,
  operations,
  paths,
} from "./generated/crabit-backend";
import { apiResult, type ApiResult } from "./result";

export type CrabitApiClient = Client<paths>;

export interface ListWishesOptions {
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  readonly cursor?: components["parameters"]["Cursor"];
  readonly limit?: components["parameters"]["Limit"];
  readonly state?: components["schemas"]["WishState"][];
}

export interface GetWishOptions {
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  readonly wishId: components["parameters"]["WishId"];
}

export interface CreateWishOptions {
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  readonly idempotencyKey: components["parameters"]["IdempotencyKey"];
  readonly body: operations["createWish"]["requestBody"]["content"]["application/json"];
}

export interface PatchWishOptions {
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  readonly wishId: components["parameters"]["WishId"];
  readonly body: operations["patchWish"]["requestBody"]["content"]["application/merge-patch+json"];
}

export interface DeleteWishOptions {
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  readonly wishId: components["parameters"]["WishId"];
  readonly idempotencyKey: components["parameters"]["IdempotencyKey"];
  readonly ifMatch: components["parameters"]["IfMatch"];
}

export interface GetRepresentativeWishOptions {
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
}

export interface SelectRepresentativeWishOptions {
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  readonly body: operations["selectRepresentativeWish"]["requestBody"]["content"]["application/json"];
}

export function listWishes(
  client: CrabitApiClient,
  options: ListWishesOptions,
): Promise<ApiResult<components["schemas"]["WishPage"]>> {
  return apiResult<components["schemas"]["WishPage"]>(() => client.GET(
    "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes",
    {
      params: {
        path: { cardBalanceAccountId: options.cardBalanceAccountId },
        query: {
          cursor: options.cursor,
          limit: options.limit,
          state: options.state,
        },
      },
    },
  ));
}

export function getWish(
  client: CrabitApiClient,
  options: GetWishOptions,
): Promise<ApiResult<components["schemas"]["Wish"]>> {
  return apiResult<components["schemas"]["Wish"]>(() => client.GET(
    "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes/{wishId}",
    {
      params: { path: options },
    },
  ));
}

export function createWish(
  client: CrabitApiClient,
  options: CreateWishOptions,
): Promise<ApiResult<components["schemas"]["WishMutationResult"]>> {
  return apiResult<components["schemas"]["WishMutationResult"]>(() => client.POST("/v1/card-balance-accounts/{cardBalanceAccountId}/wishes", {
    params: {
      path: { cardBalanceAccountId: options.cardBalanceAccountId },
      header: { "Idempotency-Key": options.idempotencyKey },
    },
    body: options.body,
  }));
}

export function patchWish(
  client: CrabitApiClient,
  options: PatchWishOptions,
): Promise<ApiResult<components["schemas"]["WishMutationResult"]>> {
  return apiResult<components["schemas"]["WishMutationResult"]>(() => client.PATCH(
    "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes/{wishId}",
    {
      params: {
        path: {
          cardBalanceAccountId: options.cardBalanceAccountId,
          wishId: options.wishId,
        },
      },
      headers: { "Content-Type": "application/merge-patch+json" },
      body: options.body,
    },
  ));
}

export function deleteWish(
  client: CrabitApiClient,
  options: DeleteWishOptions,
): Promise<ApiResult<components["schemas"]["WishMutationResult"]>> {
  return apiResult<components["schemas"]["WishMutationResult"]>(() => client.DELETE(
    "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes/{wishId}",
    {
      params: {
        path: {
          cardBalanceAccountId: options.cardBalanceAccountId,
          wishId: options.wishId,
        },
        header: {
          "Idempotency-Key": options.idempotencyKey,
          "If-Match": options.ifMatch,
        },
      },
    },
  ));
}

export function getRepresentativeWish(
  client: CrabitApiClient,
  options: GetRepresentativeWishOptions,
): Promise<ApiResult<components["schemas"]["Wish"] | undefined>> {
  return apiResult<components["schemas"]["Wish"] | undefined>(() => client.GET(
    "/v1/card-balance-accounts/{cardBalanceAccountId}/representative-wish",
    { params: { path: options } },
  ));
}

export function selectRepresentativeWish(
  client: CrabitApiClient,
  options: SelectRepresentativeWishOptions,
): Promise<ApiResult<components["schemas"]["Wish"]>> {
  return apiResult<components["schemas"]["Wish"]>(() => client.PUT(
    "/v1/card-balance-accounts/{cardBalanceAccountId}/representative-wish",
    {
      params: {
        path: { cardBalanceAccountId: options.cardBalanceAccountId },
      },
      body: options.body,
    },
  ));
}
