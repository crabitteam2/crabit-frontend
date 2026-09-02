import { notFound } from "next/navigation";
import { getWish } from "@/lib/http/wishes";
import { unwrapResult } from "@/lib/http/result";
import { loadAccountContext } from "../../load-account";
import { WishInfoScreen } from "../../_components/wish-info-screen";
import { toPeriodLabel } from "../../_components/wish-period-format";

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
        start: toDateKey(wish.createdAt),
        end: wish.targetDate?.replaceAll("-", ".") ?? null,
      })}
      photoUrl={wish.photo?.variants.medium ?? null}
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
