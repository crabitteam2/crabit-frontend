import { notFound } from "next/navigation";
import { resolveCardAccounts } from "@/lib/mock/accounts";
import { findWish } from "@/lib/mock/wishes";
import { DepositAmountForm } from "../../../_components/deposit-amount-form";

export default async function DepositAmountPage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const wish = findWish(wishId);
  if (wish === null) notFound();

  const query = await searchParams;
  const raw = query.from;
  const from = Array.isArray(raw) ? raw[0] : raw;
  const source = from?.startsWith("w") ? findWish(from) : null;
  const account = resolveCardAccounts(query)[0];
  const available = source?.amount ?? account?.balance ?? 0;

  return <DepositAmountForm wishId={wishId} available={available} />;
}
