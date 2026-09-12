import {
  fromIsoDate,
  toSavingPeriodLabel,
} from "@/app/wishes/_components/wish-period-format";
import { notFound, redirect } from "next/navigation";
import { getWish } from "@/lib/http/wishes";
import { unwrapResult } from "@/lib/http/result";
import { loadAccountContext } from "../../load-account";
import { isFinishedState } from "@/app/wishes/_components/wish-detail";
import { FlowMarkGuard } from "@/app/wishes/_components/flow-mark-guard";
import { WishCreatedScreen } from "../_components/wish-created-screen";

export default async function NewWishDonePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const wishId = query.wishId;
  if (typeof wishId !== "string" || !wishId.trim()) redirect("/wishes/new");
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await getWish(client, { cardBalanceAccountId, wishId });
  if (!result.ok && result.error.status === 404) notFound();
  const wish = unwrapResult(result);
  if (isFinishedState(wish.state)) redirect(`/wishes/${wishId}`);
  const period =
    wish.startDate === null || wish.targetDate === null
      ? null
      : toSavingPeriodLabel({
          start: fromIsoDate(wish.startDate),
          end: fromIsoDate(wish.targetDate),
        });

  return (
    <FlowMarkGuard name={`new-done:${wishId}`} fallbackHref="/wishes/new">
      <WishCreatedScreen
        purpose={wish.purpose}
        targetAmount={wish.targetAmount}
        period={period}
        photoUrl={wish.photo?.variants.large ?? null}
        depositHref={`/wishes/${wish.id}/deposit/amount?from=card&back=created`}
        closeHref="/"
      />
    </FlowMarkGuard>
  );
}
