import { notFound } from "next/navigation";
import { loadWishDetail } from "../(detail)/load-wish-detail";
import { WishShareScreen } from "../../_components/wish-share-screen";

export default async function WishSharePage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const view = await loadWishDetail(wishId);
  if (view === null) notFound();

  return (
    <WishShareScreen
      wish={view.wish}
      photoUrl={view.wish.imageUrl ?? null}
      closeHref={`/wishes/${wishId}`}
      writeHref={`/wishes/${wishId}/share/write`}
    />
  );
}
