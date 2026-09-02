import { toPeriodLabel } from "../../../_components/wish-period-format";
import { notFound } from "next/navigation";
import { getWish } from "@/lib/http/wishes";
import { unwrapResult } from "@/lib/http/result";
import { loadAccountContext } from "../../../load-account";
import { WishEditDoneScreen } from "../../../_components/wish-edit-done-screen";

export default async function WishEditDonePage({
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
    <WishEditDoneScreen
      purpose={wish.purpose}
      targetAmount={wish.targetAmount}
      period={toPeriodLabel({
        start: wish.startDate?.replaceAll("-", ".") ?? null,
        end: wish.targetDate?.replaceAll("-", ".") ?? null,
      })}
    />
  );
}
