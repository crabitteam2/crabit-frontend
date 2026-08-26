import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { WishInfoScreen } from "../../_components/wish-info-screen";
import {
  toFullDate,
  toPeriodLabel,
} from "../../_components/wish-period-format";

export default async function WishInfoPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const wish = findWish(wishId);
  if (wish === null) notFound();

  return (
    <WishInfoScreen
      backHref={`/wishes/${wishId}`}
      editHref={`/wishes/${wishId}/info/edit`}
      purpose={wish.purpose}
      targetAmount={wish.targetAmount}
      period={toPeriodLabel({
        start: toFullDate(wish.startDate),
        end: toFullDate(wish.targetDate),
      })}
    />
  );
}
