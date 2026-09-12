import { queryValue } from "@/lib/forms/wish-form-query";
import { notFound, redirect } from "next/navigation";
import { LoadingScreen } from "../../../_components/loading-screen";
import { loadFundReceipt } from "../../../fund-receipt";
import { isFinishedState } from "../../../_components/wish-detail";
import {
  CARD_COUNTERPART_ID,
  findCounterpart,
  loadFundFlow,
} from "../../fund-flow";

export default async function WithdrawLoadingPage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const view = await loadFundFlow(wishId);
  if (view === null) notFound();
  if (isFinishedState(view.wish.state)) redirect(`/wishes/${wishId}`);

  const selectPath = `/wishes/${wishId}/withdraw`;
  const query = await searchParams;
  const destination = findCounterpart(view, queryValue(query, "to"));
  if (destination === null) redirect(selectPath);

  const destinationId =
    destination.kind === "card" ? CARD_COUNTERPART_ID : destination.wish.id;

  const eventId = queryValue(query, "event");
  if ((await loadFundReceipt(wishId, eventId, "WITHDRAWAL")) === null)
    redirect(`${selectPath}/amount?to=${destinationId}`);

  return (
    <LoadingScreen
      label="돈 꺼내는 중"
      donePath={`/wishes/${wishId}/withdraw/done?to=${destinationId}&event=${eventId}`}
    />
  );
}
