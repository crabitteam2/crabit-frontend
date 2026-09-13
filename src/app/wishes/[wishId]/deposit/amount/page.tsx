import { queryValue } from "@/lib/forms/wish-form-query";
import { notFound, redirect } from "next/navigation";
import { isFinishedState } from "../../../_components/wish-detail";
import { AmountForm } from "../../../_components/amount-form";
import {
  CARD_COUNTERPART_ID,
  findCounterpart,
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
  if (isFinishedState(view.wish.state)) redirect(`/wishes/${wishId}`);

  const selectPath = `/wishes/${wishId}/deposit`;
  const query = await searchParams;
  const from =
    query.from === undefined ? CARD_COUNTERPART_ID : queryValue(query, "from");
  const source = findCounterpart(view, from);
  if (source === null) redirect(selectPath);

  const available =
    source.kind === "card" ? source.card.availableBalance : source.wish.amount;
  if (available === null) redirect(selectPath);

  const sourceId =
    source.kind === "card" ? CARD_COUNTERPART_ID : source.wish.id;
  // 새 위시 완료 화면에서 바로 들어왔으면 그 화면으로 되돌아간다.
  const backHref =
    queryValue(query, "back") === "created"
      ? `/wishes/new/done?wishId=${wishId}`
      : selectPath;
  const remaining = view.wish.targetAmount - view.wish.amount;

  return (
    <AmountForm
      title="얼마를 모아볼까요?"
      backHref={backHref}
      nextPath={`/wishes/${wishId}/deposit/coin`}
      nextParams={{ from: sourceId }}
      available={available}
      availableLabel="현재 사용 가능한 금액"
      ticketName={`deposit:${wishId}:${sourceId}`}
      max={remaining}
      overMessage="목표 금액까지 남은 만큼만 넣을 수 있어요."
    />
  );
}
