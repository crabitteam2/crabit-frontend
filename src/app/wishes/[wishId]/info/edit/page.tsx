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
      period={toPeriodLabel({
        start: toDateKey(wish.createdAt),
        end: wish.targetDate?.replaceAll("-", ".") ?? null,
      })}
      cardBalanceAccountId={cardBalanceAccountId}
      wishId={wish.id}
      version={wish.version}
      photo={wish.photo}
    />
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function toDateKey(value: string) {
  return dateFormatter.format(new Date(value)).replaceAll("-", ".");
}
