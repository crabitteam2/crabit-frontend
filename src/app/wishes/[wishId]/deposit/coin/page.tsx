import { readAmountQuery, queryValue } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { notFound } from "next/navigation";
import { DepositCoinScreen } from "../../../_components/deposit-coin-screen";
import type { FundCounterpartRef } from "../../../_components/fund-counterpart";
import { findCounterpart, loadFundFlow } from "../../fund-flow";

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
  const source = findCounterpart(view, queryValue(query, "from"));
  if (source === null) return <FormQueryError backHref={selectPath} />;

  const available =
    source.kind === "card" ? source.card.availableBalance : source.wish.amount;
  const amount = readAmountQuery(
    query,
    Math.min(available ?? -1, view.wish.targetAmount - view.wish.amount),
  );
  if (amount === null) return <FormQueryError backHref={selectPath} />;

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
