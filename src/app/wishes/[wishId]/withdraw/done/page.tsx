import { readAmountQuery } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { WithdrawDoneScreen } from "../../../_components/withdraw-done-screen";

export default async function WithdrawDonePage({
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
  const amount = readAmountQuery(query, wish.amount);
  if (amount === null)
    return <FormQueryError backHref={`/wishes/${wishId}/withdraw/amount`} />;

  return (
    <WithdrawDoneScreen
      purpose={wish.purpose}
      amount={amount}
      balanceAfter={wish.amount - amount}
    />
  );
}
