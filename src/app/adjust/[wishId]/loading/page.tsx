import { notFound } from "next/navigation";
import { LoadingScreen } from "@/app/wishes/_components/loading-screen";
import { findWish } from "@/lib/mock/wishes";

export default async function AdjustLoadingPage({
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
      label="돈 꺼내는 중"
      donePath={`/adjust/${wishId}/done?amount=${amount}`}
    />
  );
}
