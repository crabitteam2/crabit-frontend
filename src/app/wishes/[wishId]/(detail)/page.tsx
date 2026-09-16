import Link from "next/link";
import { redirect } from "next/navigation";
import { PullToRefresh } from "@/app/_components/pull-to-refresh";
import { HistorySection } from "../../_components/history-section";
import { ScreenHeader } from "../../_components/screen-header";
import { WishDetailActions } from "../../_components/wish-detail-actions";
import { isFinishedState } from "../../_components/wish-detail";
import { WishFinishedActions } from "../../_components/wish-finished-actions";
import { WishReachedActions } from "../../_components/wish-reached-actions";
import { WishSummaryCard } from "../../_components/wish-summary-card";
import { loadWishDetail } from "./load-wish-detail";

export default async function WishDetailPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const view = await loadWishDetail(wishId);
  if (view === null) redirect("/wishes");

  const { wish, movements } = view;

  const isFinished = isFinishedState(wish.state);
  const hasReachedTarget = !isFinished && wish.amount >= wish.targetAmount;

  return (
    <div className="flex flex-col">
      <ScreenHeader
        title="모은 돈 기록"
        backHref="/wishes"
        spacing="tight"
        action={isFinished ? undefined : <WishDetailActions wish={wish} />}
      />

      <PullToRefresh>
        <div className="px-4">
          <WishSummaryCard wish={wish} />
        </div>

        {isFinished ? (
          <WishFinishedActions
            wishId={wishId}
            version={wish.version}
            isShared={wish.visibility !== "PRIVATE"}
          />
        ) : hasReachedTarget ? (
          <WishReachedActions wishId={wishId} version={wish.version} />
        ) : (
          <div className="flex gap-4 px-4 pt-[22.25px] pb-[6.25px]">
            <Link
              href={`/wishes/${wishId}/deposit`}
              className="bg-brand-solid text-fg-contrast text-b4 inline-flex h-12 flex-1 items-center justify-center rounded-xl px-5 font-semibold"
            >
              돈 넣기
            </Link>
            <Link
              href={`/wishes/${wishId}/withdraw`}
              className="bg-pink-2 text-fg-brand text-b4 inline-flex h-12 flex-1 items-center justify-center rounded-xl px-5 font-semibold"
            >
              돈 꺼내기
            </Link>
          </div>
        )}

        <HistorySection movements={movements} />

        <div className="h-[calc(2.5rem+env(safe-area-inset-bottom))]" />
      </PullToRefresh>
    </div>
  );
}
