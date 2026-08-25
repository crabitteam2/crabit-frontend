import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { WishInfoScreen } from "../../_components/wish-info-screen";

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
      period={`20${wish.startDate}-20${wish.targetDate}`}
    />
  );
}
