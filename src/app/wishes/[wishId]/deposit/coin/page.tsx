import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { DepositCoinScreen } from "../../../_components/deposit-coin-screen";

export default async function DepositCoinPage({
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
  const amount = Number(value ?? 0);

  return (
    <DepositCoinScreen
      wishId={wishId}
      amount={Number.isFinite(amount) ? amount : 0}
    />
  );
}
