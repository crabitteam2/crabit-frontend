import type { components } from "@/lib/http/generated/crabit-backend";

export const FEED_PAGE_LIMIT = 10;
export type FeedPage = components["schemas"]["FeedResultResponse"];
export interface FeedRow {
  card: FeedPage["items"][number];
  resultContextId: string;
  expiresAt: string;
  position: number;
}

/** Keep the first visible card and its original, pre-deduplication page identity. */
export function appendFeedPage(rows: FeedRow[], page: FeedPage): FeedRow[] {
  const seen = new Set(rows.map(({ card }) => card.sharedCardId));
  const appended = page.items.flatMap((card, position) => {
    if (seen.has(card.sharedCardId)) return [];
    seen.add(card.sharedCardId);
    return [
      {
        card,
        position,
        resultContextId: page.resultContextId,
        expiresAt: page.expiresAt,
      },
    ];
  });
  return [...rows, ...appended];
}
