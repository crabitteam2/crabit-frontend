"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { FrontendHttpError } from "@/lib/http/errors";
import {
  blockStudent,
  followAcademyStudent,
  unblockStudent,
  unfollowAcademyStudent,
} from "@/lib/http/follows";
import type { ApiResult } from "@/lib/http/result";
import { createServerApiClient } from "@/lib/http/server";

/** 관계 쓰기 요청의 결과이며, 실패하면 화면에 그대로 보여줄 문구를 담습니다. */
export type RelationshipActionResult =
  { readonly ok: true } | { readonly ok: false; readonly message: string };

const MESSAGES: Partial<Record<FrontendHttpError["code"], string>> = {
  STUDENT_NOT_FOUND: "지금은 찾을 수 없는 학생이에요.",
  ACADEMY_NOT_FOUND: "학원 정보를 확인하지 못했어요.",
  SELF_RELATIONSHIP: "나에게는 할 수 없어요.",
  NETWORK_ERROR: "연결이 불안정해요. 잠시 후 다시 시도해주세요.",
};

const FALLBACK_MESSAGE = "잠시 후 다시 시도해주세요.";

/** 선택한 학원에서 이 학생을 팔로우합니다. */
export async function followStudentAction(
  academyId: string,
  studentId: string,
): Promise<RelationshipActionResult> {
  const result = await followAcademyStudent(await createRequestClient(), {
    academyId,
    studentId,
  });

  return settle(result, studentId);
}

/** 선택한 학원에서 이 학생을 향한 팔로우만 종료합니다. */
export async function unfollowStudentAction(
  academyId: string,
  studentId: string,
): Promise<RelationshipActionResult> {
  const result = await unfollowAcademyStudent(await createRequestClient(), {
    academyId,
    studentId,
  });

  return settle(result, studentId);
}

/** 이 학생을 모든 학원에서 차단하고 양방향 팔로우를 끊습니다. */
export async function blockStudentAction(
  studentId: string,
): Promise<RelationshipActionResult> {
  const result = await blockStudent(await createRequestClient(), {
    body: { studentId },
  });

  return settle(result, studentId, "STUDENT_BLOCK_ALREADY_ACTIVE");
}

/** 내가 만든 차단만 해제하며 끊긴 팔로우는 복원하지 않습니다. */
export async function unblockStudentAction(
  studentId: string,
): Promise<RelationshipActionResult> {
  const result = await unblockStudent(await createRequestClient(), {
    studentId,
  });

  return settle(result, studentId, "STUDENT_BLOCK_NOT_FOUND");
}

async function createRequestClient() {
  return createServerApiClient({ request: { headers: await headers() } });
}

function settle(
  result: ApiResult<unknown>,
  studentId: string,
  settledCode?: FrontendHttpError["code"],
): RelationshipActionResult {
  if (!result.ok && result.error.code !== settledCode) {
    return {
      ok: false,
      message: MESSAGES[result.error.code] ?? FALLBACK_MESSAGE,
    };
  }

  revalidatePath(`/feed/${studentId}/follows`);
  return { ok: true };
}
