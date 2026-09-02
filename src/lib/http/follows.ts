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
/** 같은 학원 전체 학생 검색 조건입니다. */
export interface SearchAcademyStudentsOptions
  extends AcademyOptions, PageOptions {
  readonly nickname: components["parameters"]["NicknameSearch"];
}
/** 본인의 팔로잉 또는 팔로워 안에서만 검색하는 조건입니다. */
export interface ListAcademyFollowsOptions extends AcademyOptions, PageOptions {
  readonly nickname?: components["parameters"]["OptionalRelationshipNickname"];
}
/** 본인에서 대상으로 향하는 선택 학원의 관계만 변경합니다. */
export interface FollowAcademyStudentOptions extends AcademyOptions {
  readonly studentId: components["parameters"]["StudentId"];
}
/** 내가 차단한 학생 목록의 페이지 조건입니다. */
export interface ListMyStudentBlocksOptions extends PageOptions {}
/** 전역 차단 생성 본문입니다. */
export interface BlockStudentOptions {
  readonly body: operations["blockStudent"]["requestBody"]["content"]["application/json"];
}
/** 본인이 만든 전역 차단을 해제할 학생입니다. */
export interface UnblockStudentOptions {
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

/** 선택 학원의 본인 팔로잉 목록과 검색과 무관한 두 전체 카운트입니다. */
export function listAcademyFollowing(
  client: CrabitApiClient,
  options: ListAcademyFollowsOptions,
) {
  return listFollows(client, "/v1/academies/{academyId}/following", options);
}
/** 선택 학원의 본인 팔로워 목록입니다. isFollowing은 역방향과 독립적입니다. */
export function listAcademyFollowers(
  client: CrabitApiClient,
  options: ListAcademyFollowsOptions,
) {
  return listFollows(client, "/v1/academies/{academyId}/followers", options);
}
function listFollows(
  client: CrabitApiClient,
  path:
    | "/v1/academies/{academyId}/following"
    | "/v1/academies/{academyId}/followers",
  options: ListAcademyFollowsOptions,
): Promise<ApiResult<components["schemas"]["FollowPage"]>> {
  return apiResult<components["schemas"]["FollowPage"]>(() =>
    client.GET(path, {
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
/** 현재 outgoing 팔로우를 요청합니다. 이미 팔로우 중이어도 204입니다. */
export function followAcademyStudent(
  client: CrabitApiClient,
  options: FollowAcademyStudentOptions,
): Promise<ApiResult<undefined>> {
  return serializeRelationship(client, options.studentId, () =>
    apiResult<undefined>(() =>
      client.PUT("/v1/academies/{academyId}/following/{studentId}", {
        params: { path: options },
      }),
    ),
  );
}
/** outgoing만 종료합니다. 부재 상태도 204이며 역방향은 유지합니다. */
export function unfollowAcademyStudent(
  client: CrabitApiClient,
  options: FollowAcademyStudentOptions,
): Promise<ApiResult<undefined>> {
  return serializeRelationship(client, options.studentId, () =>
    apiResult<undefined>(() =>
      client.DELETE("/v1/academies/{academyId}/following/{studentId}", {
        params: { path: options },
      }),
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
  return serializeRelationship(client, options.body.studentId, () =>
    apiResult<components["schemas"]["StudentBlock"]>(() =>
      client.POST("/v1/me/student-blocks", { body: options.body }),
    ),
  );
}

/** 학생 한 명의 전역 차단을 해제합니다. */
export function unblockStudent(
  client: CrabitApiClient,
  options: UnblockStudentOptions,
): Promise<ApiResult<undefined>> {
  return serializeRelationship(client, options.studentId, () =>
    apiResult<undefined>(() =>
      client.DELETE("/v1/me/student-blocks/{studentId}", {
        params: { path: options },
      }),
    ),
  );
}

// A client belongs to one authenticated context. Reuse it for all relationship
// mutations; the student key deliberately spans academies because blocks are global.
const relationshipQueues = new WeakMap<
  CrabitApiClient,
  Map<string, Promise<unknown>>
>();
function serializeRelationship<T>(
  client: CrabitApiClient,
  studentId: string,
  mutation: () => Promise<T>,
): Promise<T> {
  studentId = studentId.toLowerCase();
  let queues = relationshipQueues.get(client);
  if (!queues) {
    queues = new Map();
    relationshipQueues.set(client, queues);
  }
  const previous = queues.get(studentId) ?? Promise.resolve();
  const current = previous.catch(() => undefined).then(mutation);
  queues.set(studentId, current);
  const cleanup = () => {
    if (queues.get(studentId) === current) queues.delete(studentId);
  };
  void current.then(cleanup, cleanup);
  return current;
}
