import { readAmountQuery, queryValue } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { notFound } from "next/navigation";
import type { FundCounterpartRef } from "../../../_components/fund-counterpart";
import { WithdrawLoadingScreen } from "../../../_components/withdraw-loading-screen";
import {
  CARD_COUNTERPART_ID,
  findCounterpart,
  loadFundFlow,
} from "../../fund-flow";

export default async function WithdrawLoadingPage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const view = await loadFundFlow(wishId);
  if (view === null) notFound();

  const selectPath = `/wishes/${wishId}/withdraw`;
  const query = await searchParams;
  const destination = findCounterpart(view, queryValue(query, "to"));
  if (destination === null) return <FormQueryError backHref={selectPath} />;

  const amount = readAmountQuery(query, Number.MAX_SAFE_INTEGER);
  if (amount === null) return <FormQueryError backHref={selectPath} />;

  const destinationId =
    destination.kind === "card" ? CARD_COUNTERPART_ID : destination.wish.id;
  const destinationRef: FundCounterpartRef =
    destination.kind === "card"
      ? { kind: "card" }
      : {
          kind: "wish",
          wishId: destination.wish.id,
          version: destination.wish.version,
          purpose: destination.wish.purpose,
        };

  return (
    <WithdrawLoadingScreen
      wishId={wishId}
      amount={amount}
      expectedVersion={view.wish.version}
      destination={destinationRef}
      amountHref={`/wishes/${wishId}/withdraw/amount?to=${destinationId}`}
      doneHref={`/wishes/${wishId}/withdraw/done?to=${destinationId}&amount=${amount}`}
    />
  );
}
