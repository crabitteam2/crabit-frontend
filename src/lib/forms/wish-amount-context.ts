import { cardAccounts } from "@/lib/mock/accounts";
import { findWish, type Wish } from "@/lib/mock/wishes";
import { queryValue, type FormQuery } from "./wish-form-query";
/** Uses the existing screen snapshot only; this is not a server balance check. */
export function depositContext(wish: Wish, query: FormQuery) {
  if (Array.isArray(query.from)) return null;
  const from = queryValue(query, "from") ?? cardAccounts[0]?.id;
  if (!from || from === wish.id) return null;
  const account = cardAccounts.find(account => account.id === from);
  const source = findWish(from);
  if (!account && (!source || (source.state !== "IN_PROGRESS" && source.state !== "AMOUNT_REACHED"))) return null;
  const available = account?.balance ?? source!.amount;
  const remaining = Math.max(0, wish.targetAmount - wish.amount);
  return { from, available, remaining, maximum: Math.min(available, remaining) };
}
