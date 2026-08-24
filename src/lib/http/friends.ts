import type { Client } from "openapi-fetch";
import type { components, operations, paths } from "./generated/crabit-backend";
import { apiResult, type ApiResult } from "./result";

/** Crabit OpenAPI 계약으로 생성된 공통 클라이언트 타입입니다. */
export type CrabitApiClient = Client<paths>;

interface AcademyOptions {
  readonly academyId: components["parameters"]["AcademyId"];
}

interface PageOptions {
  readonly cursor?: components["parameters"]["Cursor"];
  readonly limit?: components["parameters"]["Limit"];
}

/** 같은 학원 학생 검색의 경로·검색어·페이지 조건입니다. */
export interface SearchAcademyStudentsOptions
  extends AcademyOptions, PageOptions {
  /** 닉네임 검색어입니다. */
  readonly nickname: components["parameters"]["NicknameSearch"];
}

/** 같은 학원 친구 목록의 경로·페이지 조건입니다. */
export interface ListAcademyFriendsOptions
  extends AcademyOptions, PageOptions {}

/** 친구 관계 해제에 필요한 학원과 학생 식별자입니다. */
export interface UnfriendAcademyStudentOptions extends AcademyOptions {
  /** 친구 관계를 해제할 학생 식별자입니다. */
  readonly studentId: components["parameters"]["StudentId"];
}

/** 친구 요청 생성에 필요한 학원 식별자와 계약 본문입니다. */
export interface SendFriendRequestOptions extends AcademyOptions {
  /** OpenAPI 계약이 정의한 친구 요청 본문입니다. */
  readonly body: operations["sendFriendRequest"]["requestBody"]["content"]["application/json"];
}

/** 보낸 또는 받은 친구 요청 목록의 경로·페이지 조건입니다. */
export interface ListFriendRequestsOptions
  extends AcademyOptions, PageOptions {}

/** 친구 요청 수락·거절·취소에 필요한 식별자입니다. */
export interface FriendRequestActionOptions extends AcademyOptions {
  /** 처리할 친구 요청 식별자입니다. */
  readonly friendRequestId: components["parameters"]["FriendRequestId"];
}

/** 내가 차단한 학생 목록의 선택적 페이지 조건입니다. */
export interface ListMyStudentBlocksOptions extends PageOptions {}

/** 학생 차단 생성에 필요한 계약 본문입니다. */
export interface BlockStudentOptions {
  /** OpenAPI 계약이 정의한 학생 차단 본문입니다. */
  readonly body: operations["blockStudent"]["requestBody"]["content"]["application/json"];
}

/** 학생 차단 해제에 필요한 학생 식별자입니다. */
export interface UnblockStudentOptions {
  /** 차단을 해제할 학생 식별자입니다. */
  readonly studentId: components["parameters"]["StudentId"];
}

/** 같은 학원 학생을 닉네임으로 검색하고 관계 상태를 함께 조회합니다. */
export function searchAcademyStudents(
  client: CrabitApiClient,
  options: SearchAcademyStudentsOptions,
): Promise<ApiResult<components["schemas"]["StudentRelationshipPage"]>> {
  return apiResult<components["schemas"]["StudentRelationshipPage"]>(() =>
    client.GET("/v1/academies/{academyId}/students", {
      params: {
        path: { academyId: options.academyId },
        query: {
          cursor: options.cursor,
          limit: options.limit,
          nickname: options.nickname,
        },
      },
    }),
  );
}

/** 같은 학원에서 현재 친구인 학생 목록을 조회합니다. */
export function listAcademyFriends(
  client: CrabitApiClient,
  options: ListAcademyFriendsOptions,
): Promise<ApiResult<components["schemas"]["FriendPage"]>> {
  return apiResult<components["schemas"]["FriendPage"]>(() =>
    client.GET("/v1/academies/{academyId}/friends", {
      params: {
        path: { academyId: options.academyId },
        query: { cursor: options.cursor, limit: options.limit },
      },
    }),
  );
}

/** 같은 학원 학생과의 친구 관계를 해제합니다. */
export function unfriendAcademyStudent(
  client: CrabitApiClient,
  options: UnfriendAcademyStudentOptions,
): Promise<ApiResult<undefined>> {
  return apiResult<undefined>(() =>
    client.DELETE("/v1/academies/{academyId}/friends/{studentId}", {
      params: {
        path: {
          academyId: options.academyId,
          studentId: options.studentId,
        },
      },
    }),
  );
}

/** 같은 학원 학생에게 친구 요청을 보냅니다. */
export function sendFriendRequest(
  client: CrabitApiClient,
  options: SendFriendRequestOptions,
): Promise<ApiResult<components["schemas"]["FriendRequest"]>> {
  return apiResult<components["schemas"]["FriendRequest"]>(() =>
    client.POST("/v1/academies/{academyId}/friend-requests", {
      params: { path: { academyId: options.academyId } },
      body: options.body,
    }),
  );
}

/** 내가 보낸 친구 요청 목록을 조회합니다. */
export function listSentFriendRequests(
  client: CrabitApiClient,
  options: ListFriendRequestsOptions,
): Promise<ApiResult<components["schemas"]["FriendRequestPage"]>> {
  return listFriendRequests(
    client,
    "/v1/academies/{academyId}/friend-requests/sent",
    options,
  );
}

/** 내가 받은 친구 요청 목록을 조회합니다. */
export function listReceivedFriendRequests(
  client: CrabitApiClient,
  options: ListFriendRequestsOptions,
): Promise<ApiResult<components["schemas"]["FriendRequestPage"]>> {
  return listFriendRequests(
    client,
    "/v1/academies/{academyId}/friend-requests/received",
    options,
  );
}

/** 아직 대기 중인 내가 보낸 친구 요청을 취소합니다. */
export function cancelFriendRequest(
  client: CrabitApiClient,
  options: FriendRequestActionOptions,
): Promise<ApiResult<components["schemas"]["FriendRequest"]>> {
  return apiResult<components["schemas"]["FriendRequest"]>(() =>
    client.DELETE(
      "/v1/academies/{academyId}/friend-requests/{friendRequestId}",
      { params: { path: options } },
    ),
  );
}

/** 받은 친구 요청을 수락하고 친구 관계를 생성합니다. */
export function acceptFriendRequest(
  client: CrabitApiClient,
  options: FriendRequestActionOptions,
): Promise<ApiResult<components["schemas"]["Friend"]>> {
  return apiResult<components["schemas"]["Friend"]>(() =>
    client.POST(
      "/v1/academies/{academyId}/friend-requests/{friendRequestId}/acceptance",
      { params: { path: options } },
    ),
  );
}

/** 받은 친구 요청을 거절합니다. */
export function rejectFriendRequest(
  client: CrabitApiClient,
  options: FriendRequestActionOptions,
): Promise<ApiResult<components["schemas"]["FriendRequest"]>> {
  return apiResult<components["schemas"]["FriendRequest"]>(() =>
    client.POST(
      "/v1/academies/{academyId}/friend-requests/{friendRequestId}/rejection",
      { params: { path: options } },
    ),
  );
}

/** 내가 차단한 학생 목록을 조회합니다. */
export function listMyStudentBlocks(
  client: CrabitApiClient,
  options: ListMyStudentBlocksOptions = {},
): Promise<ApiResult<components["schemas"]["StudentBlockPage"]>> {
  return apiResult<components["schemas"]["StudentBlockPage"]>(() =>
    client.GET("/v1/me/student-blocks", {
      params: { query: { cursor: options.cursor, limit: options.limit } },
    }),
  );
}

/** 학생 한 명을 전역 차단합니다. */
export function blockStudent(
  client: CrabitApiClient,
  options: BlockStudentOptions,
): Promise<ApiResult<components["schemas"]["StudentBlock"]>> {
  return apiResult<components["schemas"]["StudentBlock"]>(() =>
    client.POST("/v1/me/student-blocks", { body: options.body }),
  );
}

/** 학생 한 명의 전역 차단을 해제합니다. */
export function unblockStudent(
  client: CrabitApiClient,
  options: UnblockStudentOptions,
): Promise<ApiResult<undefined>> {
  return apiResult<undefined>(() =>
    client.DELETE("/v1/me/student-blocks/{studentId}", {
      params: { path: options },
    }),
  );
}

type FriendRequestListPath =
  | "/v1/academies/{academyId}/friend-requests/sent"
  | "/v1/academies/{academyId}/friend-requests/received";

function listFriendRequests(
  client: CrabitApiClient,
  path: FriendRequestListPath,
  options: ListFriendRequestsOptions,
): Promise<ApiResult<components["schemas"]["FriendRequestPage"]>> {
  return apiResult<components["schemas"]["FriendRequestPage"]>(() =>
    client.GET(path, {
      params: {
        path: { academyId: options.academyId },
        query: { cursor: options.cursor, limit: options.limit },
      },
    }),
  );
}
