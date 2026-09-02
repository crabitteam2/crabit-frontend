"use server";

import { revalidatePath } from "next/cache";
import type { FrontendHttpError } from "@/lib/http/errors";
import type { ApiResult } from "@/lib/http/result";
import type { components } from "@/lib/http/generated/crabit-backend";
import {
  abandonWish,
  completeWish,
  deleteWish,
  patchWish,
  selectRepresentativeWish,
} from "@/lib/http/wishes";
import { loadAccountContext } from "./load-account";

/** 위시 쓰기 요청의 결과이며, 실패하면 화면에 그대로 보여줄 문구를 담습니다. */
export type WishActionResult =
  { readonly ok: true } | { readonly ok: false; readonly message: string };

const MESSAGES: Partial<Record<FrontendHttpError["code"], string>> = {
  VERSION_CONFLICT: "위시 정보가 바뀌었어요. 새로고침한 뒤 다시 시도해주세요.",
  INVALID_STATE_TRANSITION: "지금은 처리할 수 없는 위시예요.",
  WISH_NOT_FOUND: "이미 사라진 위시예요.",
  NETWORK_ERROR: "연결이 불안정해요. 잠시 후 다시 시도해주세요.",
};

const FALLBACK_MESSAGE = "잠시 후 다시 시도해주세요.";

/** 카드잔액계좌의 대표 위시를 지정한 위시로 바꿉니다. */
export async function selectRepresentativeWishAction(
  wishId: string,
): Promise<WishActionResult> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await selectRepresentativeWish(client, {
    cardBalanceAccountId,
    body: { wishId },
  });

  return settle(result, ["/wishes"]);
}

/** 위시를 포기해 종료된 위시로 옮기고 모은 금액을 카드 잔액으로 돌려보냅니다. */
export async function abandonWishAction(
  wishId: string,
  expectedVersion: number,
): Promise<WishActionResult> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await abandonWish(client, {
    cardBalanceAccountId,
    wishId,
    idempotencyKey: crypto.randomUUID(),
    body: { expectedVersion },
  });

  return settle(result, ["/wishes", `/wishes/${wishId}`]);
}

/** 목표에 도달한 위시를 완료해 모은 금액을 카드 잔액으로 돌려보냅니다. */
export async function completeWishAction(
  wishId: string,
  expectedVersion: number,
): Promise<WishActionResult> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await completeWish(client, {
    cardBalanceAccountId,
    wishId,
    idempotencyKey: crypto.randomUUID(),
    body: { expectedVersion },
  });

  return settle(result, ["/wishes", `/wishes/${wishId}`]);
}

/** 위시의 공개 범위를 바꿔 학원 피드에 올리거나 내립니다. */
export async function shareWishAction(
  wishId: string,
  expectedVersion: number,
  visibility: components["schemas"]["WishVisibility"],
): Promise<WishActionResult> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await patchWish(client, {
    cardBalanceAccountId,
    wishId,
    body: { expectedVersion, visibility },
  });

  return settle(result, ["/wishes", `/wishes/${wishId}`, "/feed"]);
}

/** 종료된 위시를 삭제해 목록에서 숨깁니다. */
export async function deleteWishAction(
  wishId: string,
  expectedVersion: number,
): Promise<WishActionResult> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await deleteWish(client, {
    cardBalanceAccountId,
    wishId,
    idempotencyKey: crypto.randomUUID(),
    ifMatch: expectedVersion,
  });

  return settle(result, ["/wishes", `/wishes/${wishId}`]);
}

function settle(
  result: ApiResult<unknown>,
  paths: readonly string[],
): WishActionResult {
  if (!result.ok) {
    return {
      ok: false,
      message: MESSAGES[result.error.code] ?? FALLBACK_MESSAGE,
    };
  }

  for (const path of paths) revalidatePath(path);
  return { ok: true };
}
