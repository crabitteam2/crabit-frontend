import { amountError, normalizePurpose, parseKrw, periodError, purposeError, type Period } from "./wish-validation";
export type FormQuery = Record<string, string | string[] | undefined>;
export function queryValue(query: FormQuery, name: string): string | undefined {
  const value = query[name];
  return typeof value === "string" ? value : undefined;
}
function hasDuplicate(query: FormQuery, keys: string[]) { return keys.some(key => Array.isArray(query[key])); }
/** URL dates use ISO; legacy dotted calendar keys remain accepted for existing links. */
function dateKey(value: string | undefined): string | null {
  return value === undefined || value === "" ? null : value.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1.$2.$3");
}
export function isoDate(value: string) { return value.replaceAll(".", "-"); }
export function readWishQuery(query: FormQuery, defaults?: { purpose: string; targetAmount: number; range: Period; currentAmount: number }) {
  if (hasDuplicate(query, ["purpose", "targetAmount", "startDate", "targetDate", "period"])) return null;
  const purpose = queryValue(query, "purpose") ?? defaults?.purpose ?? "";
  const rawAmount = queryValue(query, "targetAmount") ?? (defaults ? String(defaults.targetAmount) : "");
  const range = {
    start: query.startDate === undefined ? defaults?.range.start ?? null : dateKey(queryValue(query, "startDate")),
    end: query.targetDate === undefined ? defaults?.range.end ?? null : dateKey(queryValue(query, "targetDate")),
  };
  if (purposeError(purpose) || amountError(rawAmount, undefined, defaults?.currentAmount) || periodError(range)) return null;
  return { purpose: normalizePurpose(purpose), targetAmount: parseKrw(rawAmount)!, range };
}
export function serializeWish(values: { purpose: string; targetAmount: number; range: Period }) {
  return new URLSearchParams({ purpose: values.purpose, targetAmount: String(values.targetAmount), startDate: values.range.start === null ? "" : isoDate(values.range.start), targetDate: values.range.end === null ? "" : isoDate(values.range.end) });
}
export function readAmountQuery(query: FormQuery, maximum: number) {
  if (hasDuplicate(query, ["amount", "from"])) return null;
  const value = queryValue(query, "amount") ?? "";
  return amountError(value, maximum) ? null : parseKrw(value);
}
