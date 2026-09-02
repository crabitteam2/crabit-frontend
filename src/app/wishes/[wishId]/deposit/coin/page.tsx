import { depositContext } from "@/lib/forms/wish-amount-context";
import { readAmountQuery } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { DepositCoinScreen } from "../../../_components/deposit-coin-screen";

export default async function DepositCoinPage({
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
  const context = depositContext(wish, query);
  const amount = readAmountQuery(query, context?.maximum ?? -1);
  if (amount === null)
    return <FormQueryError backHref={`/wishes/${wishId}/deposit/amount`} />;

  return (
    <DepositCoinScreen wishId={wishId} amount={amount} from={context!.from} />
  );
}
