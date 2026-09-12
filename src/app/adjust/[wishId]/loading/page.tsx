import { notFound, redirect } from "next/navigation";
import { isFinishedState } from "@/app/wishes/_components/wish-detail";
import { WithdrawLoadingScreen } from "@/app/wishes/_components/withdraw-loading-screen";
import { loadFundFlow } from "@/app/wishes/[wishId]/fund-flow";

export default async function AdjustLoadingPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const view = await loadFundFlow(wishId);
  if (view === null) notFound();
  if (isFinishedState(view.wish.state)) redirect("/adjust");

  return (
    <WithdrawLoadingScreen
      wishId={wishId}
      expectedVersion={view.wish.version}
      destination={{ kind: "card" }}
      ticketName={`adjust:${wishId}`}
      amountHref={`/adjust/${wishId}/amount`}
      doneHref={`/adjust/${wishId}/done`}
    />
  );
}
