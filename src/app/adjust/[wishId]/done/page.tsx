import { notFound } from "next/navigation";
import { WithdrawDoneScreen } from "@/app/wishes/_components/withdraw-done-screen";
import { findWish } from "@/lib/mock/wishes";

export default async function AdjustDonePage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const wish = findWish(wishId);
  if (wish === null) notFound();

  const raw = (await searchParams).amount;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(value ?? 0);
  const amount = Number.isFinite(parsed) ? parsed : 0;

  return (
    <WithdrawDoneScreen
      purpose={wish.purpose}
      amount={amount}
      balanceAfter={Math.max(0, wish.amount - amount)}
    />
  );
}
