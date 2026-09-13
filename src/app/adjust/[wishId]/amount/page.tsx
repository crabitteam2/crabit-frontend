import { notFound, redirect } from "next/navigation";
import { AmountForm } from "@/app/wishes/_components/amount-form";
import { isFinishedState } from "@/app/wishes/_components/wish-detail";
import { loadFundFlow } from "@/app/wishes/[wishId]/fund-flow";

export default async function AdjustAmountPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const view = await loadFundFlow(wishId);
  if (view === null) notFound();
  if (isFinishedState(view.wish.state)) redirect("/adjust");
  if (view.unresolvedShortage === null || view.unresolvedShortage <= 0)
    redirect("/");

  return (
    <AmountForm
      title="얼마를 꺼내볼까요?"
      backHref="/adjust"
      nextPath={`/adjust/${wishId}/loading`}
      available={view.wish.amount}
      availableLabel="현재 사용 가능한 금액"
      ticketName={`adjust:${wishId}`}
    />
  );
}
