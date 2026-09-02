import { notFound, redirect } from "next/navigation";
import { WithdrawDoneScreen } from "../../../_components/withdraw-done-screen";
import {
  findCounterpart,
  firstQueryValue,
  loadFundFlow,
  parseAmount,
} from "../../fund-flow";

export default async function WithdrawDonePage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const view = await loadFundFlow(wishId);
  if (view === null) notFound();

  const query = await searchParams;
  const amount = parseAmount(query.amount);
  if (amount === 0) redirect(`/wishes/${wishId}`);

  const destination = findCounterpart(view, firstQueryValue(query.to));

  return (
    <WithdrawDoneScreen
      purpose={view.wish.purpose}
      amount={amount}
      balanceAfter={view.wish.amount}
      title={
        destination?.kind === "wish"
          ? `${destination.wish.purpose}에 보낸 금액`
          : undefined
      }
    />
  );
}
