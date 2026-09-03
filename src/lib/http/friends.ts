import type { components } from "./generated/crabit-backend";
import { apiResult, type ApiResult } from "./result";
import type { CrabitApiClient } from "./wishes";
export interface SearchAcademyStudentsOptions { academyId: string; nickname: string; cursor?: string; limit?: number }
/** Search current students using the canonical directional-follow contract. */
export function searchAcademyStudents(client: CrabitApiClient, options: SearchAcademyStudentsOptions): Promise<ApiResult<components["schemas"]["StudentRelationshipPage"]>> {
  const { academyId, ...query } = options;
  return apiResult(() => client.GET("/v1/academies/{academyId}/students", { params: { path: { academyId }, query } }));
}
/** Resolve exactly one accessible student independently from their shared cards. */
export function getAcademyStudent(client: CrabitApiClient, options: { academyId: string; studentId: string }): Promise<ApiResult<components["schemas"]["StudentRelationship"]>> {
  return apiResult(() => client.GET("/v1/academies/{academyId}/students/{studentId}", { params: { path: options } }));
}
