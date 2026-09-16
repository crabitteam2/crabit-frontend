"use server";

import { revalidatePath } from "next/cache";
import { abandonWish, withdrawFromWish } from "@/lib/http/wishes";
import { loadAccountContext } from "@/app/wishes/load-account";
import { toActionMessage } from "@/app/wishes/action-message";

/** 한 위시에서 꺼낼 금액입니다. */
export interface AdjustWithdrawal {
  readonly wishId: string;
  readonly amount: number;
  readonly expectedVersion: number;
  /** 재시도에도 같은 요청으로 보기 위한 멱등성 키입니다. */
  readonly idempotencyKey: string;
}

/** 포기한 결과이며, 남은 부족액으로 다음 화면을 정합니다. */
export interface AdjustAbandonResult {
  /** 포기한 뒤 남은 부족액이며, 실패하면 null입니다. */
  readonly shortage: number | null;
  /** 실패했으면 화면에 보여줄 문구입니다. */
  readonly message: string | null;
}

/** 위시마다 꺼낸 결과이며, 성공한 것까지는 그대로 반영됩니다. */
export interface AdjustWithdrawResult {
  /** 실제로 꺼낸 금액의 합입니다. */
  readonly withdrawn: number;
  /** 하나라도 실패했으면 화면에 보여줄 문구입니다. */
  readonly message: string | null;
}

/**
 * 고른 위시에서 차례로 금액을 꺼냅니다.
 *
 * 한 건이 실패하면 거기서 멈추고 그때까지 꺼낸 금액을 돌려줍니다.
 * 성공한 출금은 되돌리지 않고 남은 금액을 다시 채우게 합니다.
 */
export async function adjustWithdrawAction(
  withdrawals: readonly AdjustWithdrawal[],
): Promise<AdjustWithdrawResult> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  let withdrawn = 0;

  for (const item of withdrawals) {
    const result = await withdrawFromWish(client, {
      cardBalanceAccountId,
      wishId: item.wishId,
      idempotencyKey: item.idempotencyKey,
      body: { amount: item.amount, expectedVersion: item.expectedVersion },
    });

    if (!result.ok) {
      revalidateAdjust(withdrawals);
      return { withdrawn, message: toActionMessage(result.error.code) };
    }
    withdrawn += item.amount;
  }

  revalidateAdjust(withdrawals);
  return { withdrawn, message: null };
}

function revalidateAdjust(withdrawals: readonly AdjustWithdrawal[]) {
  revalidatePath("/");
  revalidatePath("/adjust");
  revalidatePath("/wishes");
  for (const item of withdrawals) revalidatePath(`/wishes/${item.wishId}`);
}

/** 위시를 포기해 모은 금액을 카드로 되돌리고 남은 부족액을 알려줍니다. */
export async function adjustAbandonAction(
  wishId: string,
  expectedVersion: number,
): Promise<AdjustAbandonResult> {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await abandonWish(client, {
    cardBalanceAccountId,
    wishId,
    idempotencyKey: crypto.randomUUID(),
    body: { expectedVersion },
  });

  if (!result.ok) {
    return { shortage: null, message: toActionMessage(result.error.code) };
  }

  revalidatePath("/");
  revalidatePath("/adjust");
  revalidatePath("/wishes");
  revalidatePath(`/wishes/${wishId}`);

  const { account } = await loadAccountContext();
  return { shortage: account.unresolvedShortage ?? 0, message: null };
}
