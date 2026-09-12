import { queryValue } from "@/lib/forms/wish-form-query";
import { redirect } from "next/navigation";
import { DepositDoneScreen } from "../../../_components/deposit-done-screen";
import { loadFundReceipt } from "../../../fund-receipt";

export default async function DepositDonePage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const query = await searchParams;
  const receipt = await loadFundReceipt(
    wishId,
    queryValue(query, "event"),
    "DEPOSIT",
  );
  if (receipt === null) redirect(`/wishes/${wishId}`);

  return <DepositDoneScreen amount={receipt.amount} />;
}
