import type { components } from "./generated/crabit-backend";
import { apiResult, type ApiResult } from "./result";
import type { CrabitApiClient } from "./wishes";

/** 학원 공유 카드 목록 조회의 작성자와 페이지 조건입니다. */
export interface ListAcademySharedCardsOptions {
  readonly academyId: components["parameters"]["AcademyId"];
  /** 생략하면 본인 카드를 제외하고, 본인을 지정하면 공개 중인 내 카드를 봅니다. */
  readonly ownerId?: components["parameters"]["SharedCardOwnerId"];
  readonly cursor?: components["parameters"]["Cursor"];
  readonly limit?: components["parameters"]["Limit"];
}

/** 지금 권한으로 볼 수 있는 학원 공유 카드를 조회합니다. */
export function listAcademySharedCards(
  client: CrabitApiClient,
  options: ListAcademySharedCardsOptions,
): Promise<ApiResult<components["schemas"]["SharedCardPage"]>> {
  return apiResult<components["schemas"]["SharedCardPage"]>(() =>
    client.GET("/v1/academies/{academyId}/shared-cards", {
      params: {
        path: { academyId: options.academyId },
        query: {
          ownerId: options.ownerId,
          cursor: options.cursor,
          limit: options.limit,
        },
      },
    }),
  );
}
