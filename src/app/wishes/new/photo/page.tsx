import { readWishQuery, serializeWish } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { WishPhotoForm } from "../_components/wish-photo-form";

export default async function NewWishPhotoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const values = readWishQuery(await searchParams);
  if (!values) return <FormQueryError backHref="/wishes/new" />;
  const forwarded = serializeWish(values);

  return (
    <WishPhotoForm
      backHref={`/wishes/new/period?${forwarded.toString()}`}
      nextPath="/wishes/new/done"
      query={forwarded.toString()}
    />
  );
}
