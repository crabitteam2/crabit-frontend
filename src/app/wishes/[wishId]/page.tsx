import Link from "next/link";
import { notFound } from "next/navigation";
import { findWish, isFinishedWish, resolveMovements } from "@/lib/mock/wishes";
import { HistoryFilterBar } from "../_components/history-filter-bar";
import { HistoryList } from "../_components/history-list";
import { ScreenHeader } from "../_components/screen-header";
import { WishDetailActions } from "../_components/wish-detail-actions";
import { WishFinishedActions } from "../_components/wish-finished-actions";
import { WishReachedActions } from "../_components/wish-reached-actions";
import { WishSummaryCard } from "../_components/wish-summary-card";

export default async function WishDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const query = await searchParams;
  const wish = findWish(wishId, query);
  if (wish === null) notFound();

  const isJustCompleted = query.completed === wishId;
  const movements = resolveMovements(query);
  const isFinished = isFinishedWish(wish);
  const hasReachedTarget = !isFinished && wish.amount >= wish.targetAmount;

  return (
    <div className="flex flex-col">
      <ScreenHeader
        title="저축 기록 내역"
        backHref={isJustCompleted ? `/wishes?completed=${wishId}` : "/wishes"}
        spacing="tight"
        action={
          isFinished ? undefined : (
            <WishDetailActions wishId={wishId} purpose={wish.purpose} />
          )
        }
      />

      <div className="px-4">
        <WishSummaryCard wish={wish} />
      </div>

      {isFinished ? (
        <WishFinishedActions wishId={wishId} />
      ) : hasReachedTarget ? (
        <WishReachedActions wishId={wishId} />
      ) : (
        <div className="flex gap-4 px-4 pt-[22.25px] pb-[6.25px]">
          <Link
            href={`/wishes/${wishId}/deposit`}
            className="bg-brand-solid text-fg-contrast text-b4 inline-flex h-12 flex-1 items-center justify-center rounded-xl px-5 font-semibold"
          >
            저축하기
          </Link>
          <Link
            href={`/wishes/${wishId}/withdraw`}
            className="bg-brand-weak text-fg-brand text-b4 inline-flex h-12 flex-1 items-center justify-center rounded-xl px-5 font-semibold"
          >
            출금하기
          </Link>
        </div>
      )}

      <HistoryFilterBar />
      <HistoryList movements={movements} />

      <div className="h-[calc(2.5rem+env(safe-area-inset-bottom))]" />
    </div>
  );
}
