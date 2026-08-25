import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { LoadingScreen } from "../../../_components/loading-screen";

export default async function WithdrawLoadingPage({
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
  const parsed = Number(value ?? 0);
  const amount = Number.isFinite(parsed) ? parsed : 0;

  return (
    <LoadingScreen
      label="출금 처리 중"
      donePath={`/wishes/${wishId}/withdraw/done?amount=${amount}`}
    />
  );
}
