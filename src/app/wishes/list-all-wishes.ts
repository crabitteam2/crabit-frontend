import "server-only";

import type { components } from "@/lib/http/generated/crabit-backend";
import { unwrapResult } from "@/lib/http/result";
import type { ServerApiClient } from "@/lib/http/server";
import { listWishes } from "@/lib/http/wishes";

const PAGE_LIMIT = 100;

/** 커서가 끝나지 않아도 멈추는 한계이며, 위시 2,000개까지 읽습니다. */
const MAX_PAGES = 20;

/**
 * 커서를 따라가며 계좌의 위시를 모두 조회합니다.
 *
 * 한 번에 100건씩 받고 다음 커서가 없을 때까지 이어 받습니다.
 * 목록과 자금 선택이 100건에서 끊기지 않게 하려고 둡니다.
 */
export async function listAllWishes(
  client: ServerApiClient,
  cardBalanceAccountId: string,
): Promise<components["schemas"]["Wish"][]> {
  const items: components["schemas"]["Wish"][] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const result = unwrapResult(
      await listWishes(client, {
        cardBalanceAccountId,
        limit: PAGE_LIMIT,
        cursor,
      }),
    );
    items.push(...result.items);
    if (result.nextCursor === null) break;
    cursor = result.nextCursor;
  }

  return items;
}
