"use server";

import { revalidatePath } from "next/cache";
import type { FrontendHttpError } from "@/lib/http/errors";
import type { ApiResult } from "@/lib/http/result";
import type { components } from "@/lib/http/generated/crabit-backend";
import { refreshCardBalance } from "@/lib/http/card-balance-accounts";
import {
  abandonWish,
  completeWish,
  deleteWish,
  depositToWish,
  patchWish,
  selectRepresentativeWish,
  transferWishFunds,
  withdrawFromWish,
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
  INSUFFICIENT_AVAILABLE_BALANCE:
    "카드에 남은 금액보다 많아요. 금액을 다시 확인해주세요.",
  INSUFFICIENT_WISH_AMOUNT:
    "위시에 모인 금액보다 많아요. 금액을 다시 확인해주세요.",
  TARGET_AMOUNT_EXCEEDED: "목표 금액을 넘게는 넣을 수 없어요.",
  BALANCE_MISMATCH_LOCKED: "잔액 조정을 끝낸 뒤에 다시 시도해주세요.",
  BALANCE_SYNC_FAILED:
    "카드 잔액을 확인하지 못했어요. 잠시 후 다시 시도해주세요.",
  CROSS_ACCOUNT_TRANSFER_FORBIDDEN: "다른 카드의 위시로는 보낼 수 없어요.",
  IDEMPOTENCY_KEY_REUSED:
    "이미 처리한 요청이에요. 새로고침한 뒤 다시 시도해주세요.",
  INVALID_AMOUNT: "금액을 다시 확인해주세요.",
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

/** 카드 잔액과 위시 사이에서 금액을 옮기는 데 필요한 값입니다. */
export interface FundMovementCommand {
  /** 돈이 드나드는 위시 식별자입니다. */
  readonly wishId: string;
  /** 낙관적 동시성 검사를 위한 기대 버전입니다. */
  readonly expectedVersion: number;
  /** 옮길 금액이며 양의 정수입니다. */
  readonly amount: number;
  /** 화면이 붙들고 있다가 재시도에도 그대로 쓰는 멱등성 키입니다. */
  readonly idempotencyKey: string;
}

/** 같은 계좌의 두 위시 사이에서 금액을 옮기는 데 필요한 값입니다. */
export interface WishTransferCommand {
  /** 돈을 내보내는 위시 식별자입니다. */
  readonly sourceWishId: string;
  /** 돈을 받는 위시 식별자입니다. */
  readonly destinationWishId: string;
  /** 옮길 금액이며 양의 정수입니다. */
  readonly amount: number;
  /** 출발 위시의 기대 버전입니다. */
  readonly sourceExpectedVersion: number;
  /** 도착 위시의 기대 버전입니다. */
  readonly destinationExpectedVersion: number;
  /** 화면이 붙들고 있다가 재시도에도 그대로 쓰는 멱등성 키입니다. */
  readonly idempotencyKey: string;
}

/** 카드 잔액에서 위시로 금액을 옮깁니다. */
export async function depositToWishAction(
  command: FundMovementCommand,
): Promise<WishActionResult> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await depositToWish(client, {
    cardBalanceAccountId,
    wishId: command.wishId,
    idempotencyKey: command.idempotencyKey,
    body: {
      amount: command.amount,
      expectedVersion: command.expectedVersion,
    },
  });

  return settle(result, ["/wishes", `/wishes/${command.wishId}`]);
}

/** 위시에서 카드 잔액으로 금액을 되돌립니다. */
export async function withdrawFromWishAction(
  command: FundMovementCommand,
): Promise<WishActionResult> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await withdrawFromWish(client, {
    cardBalanceAccountId,
    wishId: command.wishId,
    idempotencyKey: command.idempotencyKey,
    body: {
      amount: command.amount,
      expectedVersion: command.expectedVersion,
    },
  });

  return settle(result, ["/wishes", `/wishes/${command.wishId}`]);
}

/** 같은 계좌의 두 위시 사이에서 금액을 한 번에 옮깁니다. */
export async function transferWishFundsAction(
  command: WishTransferCommand,
): Promise<WishActionResult> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await transferWishFunds(client, {
    cardBalanceAccountId,
    idempotencyKey: command.idempotencyKey,
    body: {
      sourceWishId: command.sourceWishId,
      destinationWishId: command.destinationWishId,
      amount: command.amount,
      sourceExpectedVersion: command.sourceExpectedVersion,
      destinationExpectedVersion: command.destinationExpectedVersion,
    },
  });

  return settle(result, [
    "/wishes",
    `/wishes/${command.sourceWishId}`,
    `/wishes/${command.destinationWishId}`,
  ]);
}

/** 카드사에 현재 잔액을 다시 조회해 잠긴 카드가 풀릴 수 있게 합니다. */
export async function refreshCardBalanceAction(): Promise<WishActionResult> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await refreshCardBalance(client, { cardBalanceAccountId });

  return settle(result, []);
}
