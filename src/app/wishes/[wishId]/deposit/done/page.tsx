import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { DepositDoneScreen } from "../../../_components/deposit-done-screen";

export default async function DepositDonePage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  if (findWish(wishId) === null) notFound();

  const raw = (await searchParams).amount;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const amount = Number(value ?? 0);

  return <DepositDoneScreen amount={Number.isFinite(amount) ? amount : 0} />;
}
