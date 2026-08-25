import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { findWish, resolveMovements } from "@/lib/mock/wishes";
import { HistoryFilterBar } from "../_components/history-filter-bar";
import { HistoryList } from "../_components/history-list";
import { ScreenHeader } from "../_components/screen-header";
import { WishDetailActions } from "../_components/wish-detail-actions";
import { WishSummaryCard } from "../_components/wish-summary-card";

export default async function WishDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const wish = findWish(wishId);
  if (wish === null) notFound();

  const movements = resolveMovements(await searchParams);

  return (
    <div className="flex flex-col">
      <ScreenHeader
        title="저축 기록 내역"
        backHref="/wishes"
        spacing="tight"
        action={<WishDetailActions purpose={wish.purpose} />}
      />

      <div className="px-4">
        <WishSummaryCard wish={wish} />
      </div>

      <div className="flex gap-4 px-4 pt-[22.25px] pb-[6.25px]">
        <Link
          href={`/wishes/${wishId}/deposit`}
          className="bg-brand-solid text-fg-contrast text-b4 inline-flex h-12 flex-1 items-center justify-center rounded-xl px-5 font-semibold"
        >
          저축하기
        </Link>
        <Button size="large" variant="weak" className="flex-1">
          출금하기
        </Button>
      </div>

      <HistoryFilterBar />
      <HistoryList movements={movements} />

      <div className="h-[calc(2.5rem+env(safe-area-inset-bottom))]" />
    </div>
  );
}
