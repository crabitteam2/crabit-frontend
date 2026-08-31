import type { Client } from "openapi-fetch";
import type { components, operations, paths } from "./generated/crabit-backend";
import { apiResult, type ApiResult } from "./result";

/** Crabit OpenAPI 계약으로 생성된 공통 클라이언트 타입입니다. */
export type CrabitApiClient = Client<paths>;

/** 위시 목록 조회의 계좌·페이지·상태 필터 조건입니다. */
export interface ListWishesOptions {
  /** 위시가 속한 카드잔액계좌 식별자입니다. */
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  /** 다음 페이지를 이어서 조회할 커서입니다. */
  readonly cursor?: components["parameters"]["Cursor"];
  /** 한 번에 조회할 최대 항목 수입니다. */
  readonly limit?: components["parameters"]["Limit"];
  /** 조회할 위시 상태 필터입니다. */
  readonly state?: components["schemas"]["WishState"][];
}

/** 위시 단건 조회에 필요한 계좌와 위시 식별자입니다. */
export interface GetWishOptions {
  /** 위시가 속한 카드잔액계좌 식별자입니다. */
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  /** 조회할 위시 식별자입니다. */
  readonly wishId: components["parameters"]["WishId"];
}

/** 위시 생성에 필요한 계좌, 멱등성 키, 계약 본문입니다. */
export interface CreateWishOptions {
  /** 위시를 생성할 카드잔액계좌 식별자입니다. */
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  /** 재시도 중 중복 생성을 막는 멱등성 키입니다. */
  readonly idempotencyKey: components["parameters"]["IdempotencyKey"];
  /** OpenAPI 계약이 정의한 위시 생성 본문입니다. */
  readonly body: operations["createWish"]["requestBody"]["content"]["application/json"];
}

/** 위시 부분 수정에 필요한 식별자와 merge-patch 본문입니다. */
export interface PatchWishOptions {
  /** 위시가 속한 카드잔액계좌 식별자입니다. */
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  /** 수정할 위시 식별자입니다. */
  readonly wishId: components["parameters"]["WishId"];
  /** OpenAPI 계약이 정의한 JSON Merge Patch 본문입니다. */
  readonly body: operations["patchWish"]["requestBody"]["content"]["application/merge-patch+json"];
}

/** 위시 삭제에 필요한 식별자, 멱등성 키, 기대 버전입니다. */
export interface DeleteWishOptions {
  /** 위시가 속한 카드잔액계좌 식별자입니다. */
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  /** 삭제할 위시 식별자입니다. */
  readonly wishId: components["parameters"]["WishId"];
  /** 재시도 중 중복 처리를 막는 멱등성 키입니다. */
  readonly idempotencyKey: components["parameters"]["IdempotencyKey"];
  /** 낙관적 동시성 검사를 위한 기대 버전입니다. */
  readonly ifMatch: components["parameters"]["IfMatch"];
}

/** 위시 포기에 필요한 식별자, 멱등성 키, 계약 본문입니다. */
export interface AbandonWishOptions {
  /** 위시가 속한 카드잔액계좌 식별자입니다. */
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  /** 포기할 위시 식별자입니다. */
  readonly wishId: components["parameters"]["WishId"];
  /** 재시도 중 중복 처리를 막는 멱등성 키입니다. */
  readonly idempotencyKey: components["parameters"]["IdempotencyKey"];
  /** OpenAPI 계약이 정의한 기대 버전 본문입니다. */
  readonly body: operations["abandonWish"]["requestBody"]["content"]["application/json"];
}

/** 대표 위시 조회에 필요한 카드잔액계좌 식별자입니다. */
export interface GetRepresentativeWishOptions {
  /** 대표 위시가 속한 카드잔액계좌 식별자입니다. */
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
}

/** 대표 위시 선택에 필요한 계좌 식별자와 계약 본문입니다. */
export interface SelectRepresentativeWishOptions {
  /** 대표 위시가 속한 카드잔액계좌 식별자입니다. */
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  /** OpenAPI 계약이 정의한 대표 위시 선택 본문입니다. */
  readonly body: operations["selectRepresentativeWish"]["requestBody"]["content"]["application/json"];
}

/** 카드잔액계좌의 위시 목록을 페이지·상태 조건으로 조회합니다. */
export function listWishes(
  client: CrabitApiClient,
  options: ListWishesOptions,
): Promise<ApiResult<components["schemas"]["WishPage"]>> {
  return apiResult<components["schemas"]["WishPage"]>(() =>
    client.GET("/v1/card-balance-accounts/{cardBalanceAccountId}/wishes", {
      params: {
        path: { cardBalanceAccountId: options.cardBalanceAccountId },
        query: {
          cursor: options.cursor,
          limit: options.limit,
          state: options.state,
        },
      },
    }),
  );
}

/** 위시 자금 이동 이력 조회의 페이지 조건입니다. */
export interface ListWishFundMovementsOptions {
  /** 위시가 속한 카드잔액계좌 식별자입니다. */
  readonly cardBalanceAccountId: components["parameters"]["CardBalanceAccountId"];
  /** 이력을 조회할 위시 식별자입니다. */
  readonly wishId: components["parameters"]["WishId"];
  /** 다음 페이지를 이어서 조회할 커서입니다. */
  readonly cursor?: components["parameters"]["Cursor"];
  /** 한 번에 조회할 최대 항목 수입니다. */
  readonly limit?: components["parameters"]["Limit"];
}

/** 위시 한 건의 자금 이동 이력을 조회합니다. */
export function listWishFundMovements(
  client: CrabitApiClient,
  options: ListWishFundMovementsOptions,
): Promise<ApiResult<components["schemas"]["WishFundMovementPage"]>> {
  return apiResult<components["schemas"]["WishFundMovementPage"]>(() =>
    client.GET(
      "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes/{wishId}/fund-movements",
      {
        params: {
          path: {
            cardBalanceAccountId: options.cardBalanceAccountId,
            wishId: options.wishId,
          },
          query: { cursor: options.cursor, limit: options.limit },
        },
      },
    ),
  );
}

/** 카드잔액계좌의 위시 한 건을 조회합니다. */
export function getWish(
  client: CrabitApiClient,
  options: GetWishOptions,
): Promise<ApiResult<components["schemas"]["Wish"]>> {
  return apiResult<components["schemas"]["Wish"]>(() =>
    client.GET(
      "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes/{wishId}",
      {
        params: { path: options },
      },
    ),
  );
}

/** 멱등성 키와 함께 위시를 생성합니다. */
export function createWish(
  client: CrabitApiClient,
  options: CreateWishOptions,
): Promise<ApiResult<components["schemas"]["WishMutationResult"]>> {
  return apiResult<components["schemas"]["WishMutationResult"]>(() =>
    client.POST("/v1/card-balance-accounts/{cardBalanceAccountId}/wishes", {
      params: {
        path: { cardBalanceAccountId: options.cardBalanceAccountId },
        header: { "Idempotency-Key": options.idempotencyKey },
      },
      body: options.body,
    }),
  );
}

/** JSON Merge Patch 형식으로 위시를 부분 수정합니다. */
export function patchWish(
  client: CrabitApiClient,
  options: PatchWishOptions,
): Promise<ApiResult<components["schemas"]["WishMutationResult"]>> {
  return apiResult<components["schemas"]["WishMutationResult"]>(() =>
    client.PATCH(
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
    ),
  );
}

/** 멱등성 키와 기대 버전을 사용해 위시를 삭제합니다. */
export function deleteWish(
  client: CrabitApiClient,
  options: DeleteWishOptions,
): Promise<ApiResult<components["schemas"]["WishMutationResult"]>> {
  return apiResult<components["schemas"]["WishMutationResult"]>(() =>
    client.DELETE(
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
    ),
  );
}

/** 멱등성 키와 기대 버전을 사용해 위시를 포기합니다. */
export function abandonWish(
  client: CrabitApiClient,
  options: AbandonWishOptions,
): Promise<ApiResult<components["schemas"]["WishMutationResult"]>> {
  return apiResult<components["schemas"]["WishMutationResult"]>(() =>
    client.POST(
      "/v1/card-balance-accounts/{cardBalanceAccountId}/wishes/{wishId}/abandonment",
      {
        params: {
          path: {
            cardBalanceAccountId: options.cardBalanceAccountId,
            wishId: options.wishId,
          },
          header: { "Idempotency-Key": options.idempotencyKey },
        },
        body: options.body,
      },
    ),
  );
}

/** 선택된 대표 위시를 조회하며, 없으면 성공 결과의 data가 undefined입니다. */
export function getRepresentativeWish(
  client: CrabitApiClient,
  options: GetRepresentativeWishOptions,
): Promise<ApiResult<components["schemas"]["Wish"] | undefined>> {
  return apiResult<components["schemas"]["Wish"] | undefined>(() =>
    client.GET(
      "/v1/card-balance-accounts/{cardBalanceAccountId}/representative-wish",
      { params: { path: options } },
    ),
  );
}

/** 카드잔액계좌의 대표 위시를 선택합니다. */
export function selectRepresentativeWish(
  client: CrabitApiClient,
  options: SelectRepresentativeWishOptions,
): Promise<ApiResult<components["schemas"]["Wish"]>> {
  return apiResult<components["schemas"]["Wish"]>(() =>
    client.PUT(
      "/v1/card-balance-accounts/{cardBalanceAccountId}/representative-wish",
      {
        params: {
          path: { cardBalanceAccountId: options.cardBalanceAccountId },
        },
        body: options.body,
      },
    ),
  );
}
