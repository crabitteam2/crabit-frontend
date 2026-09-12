import { notFound, redirect } from "next/navigation";
import { LoadingScreen } from "@/app/wishes/_components/loading-screen";
import { loadFundFlow } from "@/app/wishes/[wishId]/fund-flow";
import { loadFundReceipt } from "@/app/wishes/fund-receipt";
import { queryValue } from "@/lib/forms/wish-form-query";

export default async function AdjustLoadingPage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  if ((await loadFundFlow(wishId)) === null) notFound();

  const eventId = queryValue(await searchParams, "event");
  if ((await loadFundReceipt(wishId, eventId, "WITHDRAWAL")) === null)
    redirect(`/adjust/${wishId}/amount`);

  return (
    <LoadingScreen
      label="돈 꺼내는 중"
      donePath={`/adjust/${wishId}/done?event=${eventId}`}
    />
  );
}
