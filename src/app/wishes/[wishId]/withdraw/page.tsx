import { notFound } from "next/navigation";
import { PullToRefresh } from "@/app/_components/pull-to-refresh";
import { AccountSelect } from "../../_components/account-select";
import { ScreenHeader } from "../../_components/screen-header";
import { refreshCardBalanceAction } from "../../wish-actions";
import { CARD_COUNTERPART_ID, loadFundFlow } from "../fund-flow";

export default async function WithdrawAccountPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const view = await loadFundFlow(wishId);
  if (view === null) notFound();

  const targets = view.others.filter((wish) => wish.amount < wish.targetAmount);

  return (
    <div className="flex flex-col">
      <ScreenHeader
        title="어떤 카드로 보낼까요?"
        backHref={`/wishes/${wishId}`}
        spacing="loose"
      />
      <PullToRefresh onRefresh={refreshCardBalanceAction}>
        <AccountSelect
          nextPath={`/wishes/${wishId}/withdraw/amount`}
          paramName="to"
          card={{
            id: CARD_COUNTERPART_ID,
            name: view.card.name,
            cardNumber: view.card.cardNumber,
            balance: view.card.availableBalance,
          }}
          wishes={targets}
        />
      </PullToRefresh>
    </div>
  );
}
