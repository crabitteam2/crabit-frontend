import { readAmountQuery, queryValue } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { notFound } from "next/navigation";
import { WithdrawDoneScreen } from "../../../_components/withdraw-done-screen";
import { findCounterpart, loadFundFlow } from "../../fund-flow";

export default async function WithdrawDonePage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const view = await loadFundFlow(wishId);
  if (view === null) notFound();

  const query = await searchParams;
  const amount = readAmountQuery(query, Number.MAX_SAFE_INTEGER);
  if (amount === null)
    return <FormQueryError backHref={`/wishes/${wishId}/withdraw`} />;

  const destination = findCounterpart(view, queryValue(query, "to"));
  if (destination === null)
    return <FormQueryError backHref={`/wishes/${wishId}/withdraw`} />;

  return (
    <WithdrawDoneScreen
      purpose={view.wish.purpose}
      amount={amount}
      balanceAfter={view.wish.amount}
      title={
        destination?.kind === "wish"
          ? `${destination.wish.purpose}에 보낸 금액`
          : undefined
      }
    />
  );
}
