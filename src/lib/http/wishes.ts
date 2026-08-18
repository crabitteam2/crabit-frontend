import type { Client } from "openapi-fetch";
import type {
  components,
  operations,
  paths,
} from "./generated/crabit-backend";

export type CrabitApiClient = Client<paths>;

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

export function createWish(client: CrabitApiClient, options: CreateWishOptions) {
  return client.POST("/v1/card-balance-accounts/{cardBalanceAccountId}/wishes", {
    params: {
      path: { cardBalanceAccountId: options.cardBalanceAccountId },
      header: { "Idempotency-Key": options.idempotencyKey },
    },
    body: options.body,
  });
}

export function patchWish(client: CrabitApiClient, options: PatchWishOptions) {
  return client.PATCH(
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
  );
}

export function deleteWish(client: CrabitApiClient, options: DeleteWishOptions) {
  return client.DELETE(
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
  );
}
