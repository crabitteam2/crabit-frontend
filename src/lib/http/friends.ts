import type { Client } from "openapi-fetch";
import type {
  components,
  operations,
  paths,
} from "./generated/crabit-backend";
import { apiResult, type ApiResult } from "./result";

export type CrabitApiClient = Client<paths>;

interface AcademyOptions {
  readonly academyId: components["parameters"]["AcademyId"];
}

interface PageOptions {
  readonly cursor?: components["parameters"]["Cursor"];
  readonly limit?: components["parameters"]["Limit"];
}

export interface SearchAcademyStudentsOptions extends AcademyOptions, PageOptions {
  readonly nickname: components["parameters"]["NicknameSearch"];
}

export interface ListAcademyFriendsOptions extends AcademyOptions, PageOptions {}

export interface UnfriendAcademyStudentOptions extends AcademyOptions {
  readonly studentId: components["parameters"]["StudentId"];
}

export interface SendFriendRequestOptions extends AcademyOptions {
  readonly body: operations["sendFriendRequest"]["requestBody"]["content"]["application/json"];
}

export interface ListFriendRequestsOptions extends AcademyOptions, PageOptions {}

export interface FriendRequestActionOptions extends AcademyOptions {
  readonly friendRequestId: components["parameters"]["FriendRequestId"];
}

export interface ListMyStudentBlocksOptions extends PageOptions {}

export interface BlockStudentOptions {
  readonly body: operations["blockStudent"]["requestBody"]["content"]["application/json"];
}

export interface UnblockStudentOptions {
  readonly studentId: components["parameters"]["StudentId"];
}

export function searchAcademyStudents(
  client: CrabitApiClient,
  options: SearchAcademyStudentsOptions,
): Promise<ApiResult<components["schemas"]["StudentRelationshipPage"]>> {
  return apiResult<components["schemas"]["StudentRelationshipPage"]>(() => client.GET(
    "/v1/academies/{academyId}/students",
    {
      params: {
        path: { academyId: options.academyId },
        query: {
          cursor: options.cursor,
          limit: options.limit,
          nickname: options.nickname,
        },
      },
    },
  ));
}

export function listAcademyFriends(
  client: CrabitApiClient,
  options: ListAcademyFriendsOptions,
): Promise<ApiResult<components["schemas"]["FriendPage"]>> {
  return apiResult<components["schemas"]["FriendPage"]>(() => client.GET(
    "/v1/academies/{academyId}/friends",
    {
      params: {
        path: { academyId: options.academyId },
        query: { cursor: options.cursor, limit: options.limit },
      },
    },
  ));
}

export function unfriendAcademyStudent(
  client: CrabitApiClient,
  options: UnfriendAcademyStudentOptions,
): Promise<ApiResult<undefined>> {
  return apiResult<undefined>(() => client.DELETE(
    "/v1/academies/{academyId}/friends/{studentId}",
    {
      params: {
        path: {
          academyId: options.academyId,
          studentId: options.studentId,
        },
      },
    },
  ));
}

export function sendFriendRequest(
  client: CrabitApiClient,
  options: SendFriendRequestOptions,
): Promise<ApiResult<components["schemas"]["FriendRequest"]>> {
  return apiResult<components["schemas"]["FriendRequest"]>(() => client.POST(
    "/v1/academies/{academyId}/friend-requests",
    {
      params: { path: { academyId: options.academyId } },
      body: options.body,
    },
  ));
}

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

export function cancelFriendRequest(
  client: CrabitApiClient,
  options: FriendRequestActionOptions,
): Promise<ApiResult<components["schemas"]["FriendRequest"]>> {
  return apiResult<components["schemas"]["FriendRequest"]>(() => client.DELETE(
    "/v1/academies/{academyId}/friend-requests/{friendRequestId}",
    { params: { path: options } },
  ));
}

export function acceptFriendRequest(
  client: CrabitApiClient,
  options: FriendRequestActionOptions,
): Promise<ApiResult<components["schemas"]["Friend"]>> {
  return apiResult<components["schemas"]["Friend"]>(() => client.POST(
    "/v1/academies/{academyId}/friend-requests/{friendRequestId}/acceptance",
    { params: { path: options } },
  ));
}

export function rejectFriendRequest(
  client: CrabitApiClient,
  options: FriendRequestActionOptions,
): Promise<ApiResult<components["schemas"]["FriendRequest"]>> {
  return apiResult<components["schemas"]["FriendRequest"]>(() => client.POST(
    "/v1/academies/{academyId}/friend-requests/{friendRequestId}/rejection",
    { params: { path: options } },
  ));
}

export function listMyStudentBlocks(
  client: CrabitApiClient,
  options: ListMyStudentBlocksOptions = {},
): Promise<ApiResult<components["schemas"]["StudentBlockPage"]>> {
  return apiResult<components["schemas"]["StudentBlockPage"]>(() => client.GET(
    "/v1/me/student-blocks",
    { params: { query: { cursor: options.cursor, limit: options.limit } } },
  ));
}

export function blockStudent(
  client: CrabitApiClient,
  options: BlockStudentOptions,
): Promise<ApiResult<components["schemas"]["StudentBlock"]>> {
  return apiResult<components["schemas"]["StudentBlock"]>(() => client.POST(
    "/v1/me/student-blocks",
    { body: options.body },
  ));
}

export function unblockStudent(
  client: CrabitApiClient,
  options: UnblockStudentOptions,
): Promise<ApiResult<undefined>> {
  return apiResult<undefined>(() => client.DELETE(
    "/v1/me/student-blocks/{studentId}",
    { params: { path: options } },
  ));
}

type FriendRequestListPath =
  | "/v1/academies/{academyId}/friend-requests/sent"
  | "/v1/academies/{academyId}/friend-requests/received";

function listFriendRequests(
  client: CrabitApiClient,
  path: FriendRequestListPath,
  options: ListFriendRequestsOptions,
): Promise<ApiResult<components["schemas"]["FriendRequestPage"]>> {
  return apiResult<components["schemas"]["FriendRequestPage"]>(() => client.GET(path, {
    params: {
      path: { academyId: options.academyId },
      query: { cursor: options.cursor, limit: options.limit },
    },
  }));
}
