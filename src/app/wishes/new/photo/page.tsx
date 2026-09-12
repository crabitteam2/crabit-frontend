import { redirect } from "next/navigation";
import {
  queryValue,
  readWishQuery,
  serializeWish,
} from "@/lib/forms/wish-form-query";
import { hasUnresolvedShortage } from "../../load-account";
import { WishPhotoForm } from "../_components/wish-photo-form";

export default async function NewWishPhotoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const cardBalanceAccountId = queryValue(query, "cardBalanceAccountId");
  const values = readWishQuery(query);
  if (!values || !cardBalanceAccountId?.trim()) redirect("/wishes/new");
  const forwarded = serializeWish(values);
  forwarded.set("cardBalanceAccountId", cardBalanceAccountId);

  return (
    <WishPhotoForm
      backHref={`/wishes/new/period?${forwarded.toString()}`}
      nextPath="/wishes/new/done"
      query={forwarded.toString()}
      cardBalanceAccountId={cardBalanceAccountId}
    />
  );
}
