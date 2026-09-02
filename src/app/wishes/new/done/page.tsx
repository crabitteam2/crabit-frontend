import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { toSavingPeriodLabel } from "@/app/wishes/_components/wish-period-format";
import { notFound } from "next/navigation";
import { getWish } from "@/lib/http/wishes";
import { unwrapResult } from "@/lib/http/result";
import { loadAccountContext } from "../../load-account";
import { WishCreatedScreen } from "../_components/wish-created-screen";

export default async function NewWishDonePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const wishId = query.wishId;
  if (typeof wishId !== "string" || !wishId.trim())
    return <FormQueryError backHref="/wishes/new" />;
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await getWish(client, { cardBalanceAccountId, wishId });
  if (!result.ok && result.error.status === 404) notFound();
  const wish = unwrapResult(result);
  const period = toSavingPeriodLabel({
    start: wish.startDate?.replaceAll("-", ".") ?? null,
    end: wish.targetDate?.replaceAll("-", ".") ?? null,
  });

  return (
    <WishCreatedScreen
      purpose={wish.purpose}
      targetAmount={wish.targetAmount}
      period={period || null}
      photoUrl={wish.photo?.variants.large ?? null}
      depositHref={`/wishes/${wish.id}/deposit/amount`}
      closeHref="/"
    />
  );
}
