import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { WishShareScreen } from "../../_components/wish-share-screen";

export default async function WishSharePage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const query = await searchParams;
  const wish = findWish(wishId, query);
  if (wish === null) notFound();

  return (
    <WishShareScreen
      wish={wish}
      photoUrl={wish.imageUrl ?? null}
      closeHref={`/wishes/${wishId}`}
      writeHref={`/wishes/${wishId}/share/write`}
    />
  );
}
