import { notFound, redirect } from "next/navigation";
import { AmountForm } from "../../../_components/amount-form";
import {
  CARD_COUNTERPART_ID,
  findCounterpart,
  firstQueryValue,
  loadFundFlow,
} from "../../fund-flow";

export default async function DepositAmountPage({
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
  const from = firstQueryValue((await searchParams).from);
  const source = findCounterpart(view, from);
  if (source === null) redirect(selectPath);

  const available =
    source.kind === "card" ? source.card.availableBalance : source.wish.amount;
  if (available === null) redirect(selectPath);

  const sourceId =
    source.kind === "card" ? CARD_COUNTERPART_ID : source.wish.id;
  const remaining = view.wish.targetAmount - view.wish.amount;

  return (
    <AmountForm
      title="얼마를 모아볼까요?"
      backHref={selectPath}
      nextPath={`/wishes/${wishId}/deposit/coin`}
      nextParams={{ from: sourceId }}
      available={available}
      availableLabel="현재 사용 가능한 금액"
      max={remaining}
      overMessage="목표 금액까지 남은 만큼만 넣을 수 있어요."
    />
  );
}
