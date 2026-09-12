import { notFound, redirect } from "next/navigation";
import { WithdrawDoneScreen } from "@/app/wishes/_components/withdraw-done-screen";
import { loadFundFlow } from "@/app/wishes/[wishId]/fund-flow";
import { loadFundReceipt } from "@/app/wishes/fund-receipt";
import { queryValue } from "@/lib/forms/wish-form-query";

export default async function AdjustDonePage({
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
  if (receipt === null) redirect("/adjust");

  return (
    <WithdrawDoneScreen
      purpose={view.wish.purpose}
      amount={receipt.amount}
      balanceAfter={receipt.balanceAfter}
    />
  );
}
