import { redirect } from "next/navigation";
import { DepositDoneScreen } from "../../../_components/deposit-done-screen";
import { parseAmount } from "../../fund-flow";

export default async function DepositDonePage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const amount = parseAmount((await searchParams).amount);
  if (amount === 0) redirect(`/wishes/${wishId}`);

  return <DepositDoneScreen amount={amount} />;
}
