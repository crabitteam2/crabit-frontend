import { notFound } from "next/navigation";
import { getWish } from "@/lib/http/wishes";
import { unwrapResult } from "@/lib/http/result";
import { loadAccountContext } from "../../load-account";
import { WishCreatedScreen } from "../_components/wish-created-screen";

function read(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

export default async function NewWishDonePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const wishId = read(query, "wishId");
  if (wishId === undefined) notFound();
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await getWish(client, { cardBalanceAccountId, wishId });
  if (!result.ok && result.error.status === 404) notFound();
  const wish = unwrapResult(result);
  const period =
    wish.targetDate === null
      ? null
      : `${toShortDate(wish.createdAt)} ~ ${toShortDate(wish.targetDate)}`;

  return (
    <WishCreatedScreen
      purpose={wish.purpose}
      targetAmount={wish.targetAmount}
      period={period}
      photoUrl={wish.photo?.variants.large ?? null}
      depositHref={`/wishes/${wish.id}/deposit/amount`}
      closeHref="/"
    />
  );
}

const shortDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
});

function toShortDate(value: string) {
  return shortDateFormatter.format(new Date(value)).replaceAll("-", ".");
}
