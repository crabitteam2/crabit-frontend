import { notFound } from "next/navigation";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { WithdrawLoadingScreen } from "@/app/wishes/_components/withdraw-loading-screen";
import { loadFundFlow } from "@/app/wishes/[wishId]/fund-flow";
import { readAmountQuery } from "@/lib/forms/wish-form-query";

export default async function AdjustLoadingPage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const view = await loadFundFlow(wishId);
  if (view === null) notFound();

  const amount = readAmountQuery(await searchParams, Number.MAX_SAFE_INTEGER);
  if (amount === null)
    return <FormQueryError backHref={`/adjust/${wishId}/amount`} />;

  return (
    <WithdrawLoadingScreen
      wishId={wishId}
      amount={amount}
      expectedVersion={view.wish.version}
      destination={{ kind: "card" }}
      amountHref={`/adjust/${wishId}/amount`}
      doneHref={`/adjust/${wishId}/done?amount=${amount}`}
    />
  );
}
