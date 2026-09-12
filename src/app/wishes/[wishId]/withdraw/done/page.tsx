import { queryValue } from "@/lib/forms/wish-form-query";
import { notFound, redirect } from "next/navigation";
import { WithdrawDoneScreen } from "../../../_components/withdraw-done-screen";
import { loadFundReceipt } from "../../../fund-receipt";
import { findCounterpart, loadFundFlow } from "../../fund-flow";

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
  const receipt = await loadFundReceipt(
    wishId,
    queryValue(query, "event"),
    "WITHDRAWAL",
  );
  if (receipt === null) redirect(`/wishes/${wishId}`);

  const destination = findCounterpart(view, queryValue(query, "to"));

  return (
    <WithdrawDoneScreen
      purpose={view.wish.purpose}
      amount={receipt.amount}
      balanceAfter={receipt.balanceAfter}
      title={
        destination?.kind === "wish"
          ? `${destination.wish.purpose}에 보낸 금액`
          : undefined
      }
    />
  );
}
