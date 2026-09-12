import "server-only";

import { headers } from "next/headers";
import { listMyCardBalanceAccounts } from "@/lib/http/card-balance-accounts";
import type { components } from "@/lib/http/generated/crabit-backend";
import { unwrapResult } from "@/lib/http/result";
import { createServerApiClient, type ServerApiClient } from "@/lib/http/server";

/** 계좌를 하나도 받지 못해 위시를 조회할 수 없을 때 발생합니다. */
export class CardBalanceAccountMissingError extends Error {
  constructor() {
    super("No card balance account is available for this student");
    this.name = "CardBalanceAccountMissingError";
  }
}

/** 서버에서 위시 API를 부를 때 필요한 클라이언트와 계좌 식별자입니다. */
export interface AccountContext {
  /** persona 토큰이 주입된 서버 클라이언트입니다. */
  readonly client: ServerApiClient;
  /** 인증된 학생의 첫 카드잔액계좌 식별자입니다. */
  readonly cardBalanceAccountId: string;
  /** 잔액과 잔액 인지 상태를 담은 첫 카드잔액계좌 스냅샷입니다. */
  readonly account: components["schemas"]["CardBalanceAccount"];
}

/**
 * 카드 잔액이 모자라 위시를 바꿀 수 없는 상태인지 확인합니다.
 *
 * 잔액을 한 번도 조회하지 못한 계좌는 모자란지 알 수 없어 false입니다.
 */
export async function hasUnresolvedShortage() {
  const { account } = await loadAccountContext();
  return account.unresolvedShortage !== null && account.unresolvedShortage > 0;
}

/**
 * 요청 쿠키의 persona로 서버 클라이언트를 만들고 첫 카드잔액계좌를 찾습니다.
 *
 * @throws {@link CardBalanceAccountMissingError} 계좌를 하나도 받지 못했을 때 발생합니다.
 */
export async function loadAccountContext(): Promise<AccountContext> {
  const cookie = (await headers()).get("cookie") ?? "";
  const client = createServerApiClient({
    request: { headers: new Headers({ cookie }) },
  });

  const accounts = unwrapResult(await listMyCardBalanceAccounts(client));
  const account = accounts.items[0];
  if (account === undefined) {
    throw new CardBalanceAccountMissingError();
  }

  return {
    client,
    cardBalanceAccountId: account.cardBalanceAccountId,
    account,
  };
}
