import { WishPhotoForm } from "../_components/wish-photo-form";

export default async function NewWishPhotoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const forwarded = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    forwarded.set(key, Array.isArray(value) ? (value[0] ?? "") : value);
  }

  return (
    <WishPhotoForm
      backHref={`/wishes/new/period?${forwarded.toString()}`}
      nextPath="/wishes/new/done"
      query={forwarded.toString()}
    />
  );
}
