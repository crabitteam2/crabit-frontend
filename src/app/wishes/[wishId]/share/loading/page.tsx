import { redirect } from "next/navigation";
import { loadWishDetail } from "../../(detail)/load-wish-detail";
import { ShareLoadingScreen } from "../../../_components/share-loading-screen";

export default async function WishShareLoadingPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const view = await loadWishDetail(wishId);
  if (view === null) redirect("/wishes");
  if (view.wish.visibility !== "PRIVATE") redirect("/feed/me");

  return (
    <ShareLoadingScreen
      wishId={wishId}
      expectedVersion={view.wish.version}
      ticketName={`share:${wishId}`}
      writeHref={`/wishes/${wishId}/share/write`}
      doneHref="/feed/me"
    />
  );
}
