import { notFound, redirect } from "next/navigation";
import type { FundCounterpartRef } from "../../../_components/fund-counterpart";
import { WithdrawLoadingScreen } from "../../../_components/withdraw-loading-screen";
import {
  CARD_COUNTERPART_ID,
  findCounterpart,
  firstQueryValue,
  loadFundFlow,
  parseAmount,
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
  const destination = findCounterpart(view, firstQueryValue(query.to));
  if (destination === null) redirect(selectPath);

  const amount = parseAmount(query.amount);
  if (amount === 0) redirect(selectPath);

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
