import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { WishEditForm } from "../../../_components/wish-edit-form";
import {
  toFullDate,
  toPeriodLabel,
} from "../../../_components/wish-period-format";

export default async function WishEditPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const wish = findWish(wishId);
  if (wish === null) notFound();

  return (
    <WishEditForm
      backHref={`/wishes/${wishId}/info`}
      donePath={`/wishes/${wishId}/info/done`}
      purpose={wish.purpose}
      targetAmount={wish.targetAmount}
      period={toPeriodLabel({
        start: toFullDate(wish.startDate),
        end: toFullDate(wish.targetDate),
      })}
    />
  );
}
