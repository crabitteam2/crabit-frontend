import { notFound } from "next/navigation";
import { getWish } from "@/lib/http/wishes";
import { unwrapResult } from "@/lib/http/result";
import { loadAccountContext } from "../../load-account";
import { WishInfoScreen } from "../../_components/wish-info-screen";
import {
  fromIsoDate,
  toPeriodLabel,
} from "../../_components/wish-period-format";

export default async function WishInfoPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await getWish(client, { cardBalanceAccountId, wishId });
  if (!result.ok && result.error.status === 404) notFound();
  const wish = unwrapResult(result);

  return (
    <WishInfoScreen
      backHref={`/wishes/${wishId}`}
      editHref={`/wishes/${wishId}/info/edit`}
      purpose={wish.purpose}
      targetAmount={wish.targetAmount}
      period={toPeriodLabel({
        start: fromIsoDate(wish.startDate),
        end: fromIsoDate(wish.targetDate),
      })}
      photoUrl={wish.photo?.variants.medium ?? null}
    />
  );
}
