import { readAmountQuery, queryValue } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { notFound } from "next/navigation";
import { DepositDoneScreen } from "../../../_components/deposit-done-screen";
import { loadFundFlow, findCounterpart } from "../../fund-flow";

export default async function DepositDonePage({
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
  const source = findCounterpart(view, queryValue(query, "from"));
  const amount = readAmountQuery(query, Number.MAX_SAFE_INTEGER);
  if (source === null || amount === null)
    return <FormQueryError backHref={`/wishes/${wishId}/deposit`} />;

  return <DepositDoneScreen amount={amount} />;
}
