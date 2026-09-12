import { queryValue } from "@/lib/forms/wish-form-query";
import { notFound, redirect } from "next/navigation";
import { isFinishedState } from "../../../_components/wish-detail";
import { DepositCoinScreen } from "../../../_components/deposit-coin-screen";
import type { FundCounterpartRef } from "../../../_components/fund-counterpart";
import {
  CARD_COUNTERPART_ID,
  findCounterpart,
  loadFundFlow,
} from "../../fund-flow";

export default async function DepositCoinPage({
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

  const selectPath = `/wishes/${wishId}/deposit`;
  const query = await searchParams;
  const source = findCounterpart(view, queryValue(query, "from"));
  if (source === null) redirect(selectPath);

  const sourceId =
    source.kind === "card" ? CARD_COUNTERPART_ID : source.wish.id;

  const sourceRef: FundCounterpartRef =
    source.kind === "card"
      ? { kind: "card" }
      : {
          kind: "wish",
          wishId: source.wish.id,
          version: source.wish.version,
          purpose: source.wish.purpose,
        };

  return (
    <DepositCoinScreen
      wishId={wishId}
      expectedVersion={view.wish.version}
      source={sourceRef}
      ticketName={`deposit:${wishId}:${sourceId}`}
      amountHref={`${selectPath}/amount?from=${sourceId}`}
    />
  );
}
