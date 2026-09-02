import { notFound, redirect } from "next/navigation";
import { AmountForm } from "../../../_components/amount-form";
import {
  CARD_COUNTERPART_ID,
  findCounterpart,
  firstQueryValue,
  loadFundFlow,
} from "../../fund-flow";

export default async function WithdrawAmountPage({
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
  const destination = findCounterpart(
    view,
    firstQueryValue((await searchParams).to),
  );
  if (destination === null) redirect(selectPath);

  const destinationId =
    destination.kind === "card" ? CARD_COUNTERPART_ID : destination.wish.id;
  const room =
    destination.kind === "card"
      ? view.wish.amount
      : destination.wish.targetAmount - destination.wish.amount;

  return (
    <AmountForm
      title="얼마를 꺼내볼까요?"
      backHref={selectPath}
      nextPath={`/wishes/${wishId}/withdraw/loading`}
      nextParams={{ to: destinationId }}
      available={view.wish.amount}
      availableLabel="현재 사용 가능한 금액"
      max={room}
      overMessage="보낼 위시의 목표 금액까지만 보낼 수 있어요."
    />
  );
}
