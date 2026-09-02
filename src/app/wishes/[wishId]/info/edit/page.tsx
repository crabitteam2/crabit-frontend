import { notFound } from "next/navigation";
import { getWish } from "@/lib/http/wishes";
import { unwrapResult } from "@/lib/http/result";
import { loadAccountContext } from "../../../load-account";
import { WishEditForm } from "../../../_components/wish-edit-form";
import { toPeriodLabel } from "../../../_components/wish-period-format";

export default async function WishEditPage({
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
    <WishEditForm
      backHref={`/wishes/${wishId}/info`}
      donePath={`/wishes/${wishId}/info/done`}
      purpose={wish.purpose}
      targetAmount={wish.targetAmount}
      currentAmount={wish.amount}
      period={toPeriodLabel({
        start: wish.startDate?.replaceAll("-", ".") ?? null,
        end: wish.targetDate?.replaceAll("-", ".") ?? null,
      })}
      cardBalanceAccountId={cardBalanceAccountId}
      wishId={wish.id}
      version={wish.version}
      photo={wish.photo}
    />
  );
}
