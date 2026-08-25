import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { WishEditForm } from "../../../_components/wish-edit-form";

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
      period={`20${wish.startDate}-20${wish.targetDate}`}
    />
  );
}
