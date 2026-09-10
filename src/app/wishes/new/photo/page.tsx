import {
  queryValue,
  readWishQuery,
  serializeWish,
} from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { WishPhotoForm } from "../_components/wish-photo-form";

export default async function NewWishPhotoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const cardBalanceAccountId = queryValue(query, "cardBalanceAccountId");
  const values = readWishQuery(query);
  if (!values || !cardBalanceAccountId?.trim())
    return <FormQueryError backHref="/wishes/new" />;
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
