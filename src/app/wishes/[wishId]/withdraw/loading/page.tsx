import { queryValue } from "@/lib/forms/wish-form-query";
import { notFound, redirect } from "next/navigation";
import type { FundCounterpartRef } from "../../../_components/fund-counterpart";
import { isFinishedState } from "../../../_components/wish-detail";
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
  if (isFinishedState(view.wish.state)) redirect(`/wishes/${wishId}`);

  const selectPath = `/wishes/${wishId}/withdraw`;
  const destination = findCounterpart(
    view,
    queryValue(await searchParams, "to"),
  );
  if (destination === null) redirect(selectPath);

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
      expectedVersion={view.wish.version}
      destination={destinationRef}
      ticketName={`withdraw:${wishId}:${destinationId}`}
      amountHref={`${selectPath}/amount?to=${destinationId}`}
      doneHref={`${selectPath}/done?to=${destinationId}`}
    />
  );
}
