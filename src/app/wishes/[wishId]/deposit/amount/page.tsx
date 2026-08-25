import { notFound } from "next/navigation";
import { cardAccounts } from "@/lib/mock/accounts";
import { findWish } from "@/lib/mock/wishes";
import { AmountForm } from "../../../_components/amount-form";

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
  const account = cardAccounts[0];
  const available = source?.amount ?? account?.balance ?? 0;

  return (
    <AmountForm
      title="얼마를 저축할까요?"
      backHref={`/wishes/${wishId}/deposit`}
      nextPath={`/wishes/${wishId}/deposit/coin`}
      available={available}
      availableLabel="현재 사용 가능한 금액"
    />
  );
}
