import { notFound, redirect } from "next/navigation";
import { DepositCoinScreen } from "../../../_components/deposit-coin-screen";
import type { FundCounterpartRef } from "../../../_components/fund-counterpart";
import {
  findCounterpart,
  firstQueryValue,
  loadFundFlow,
  parseAmount,
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

  const selectPath = `/wishes/${wishId}/deposit`;
  const query = await searchParams;
  const source = findCounterpart(view, firstQueryValue(query.from));
  if (source === null) redirect(selectPath);

  const amount = parseAmount(query.amount);
  if (amount === 0) redirect(selectPath);

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
      amount={amount}
      expectedVersion={view.wish.version}
      source={sourceRef}
    />
  );
}
