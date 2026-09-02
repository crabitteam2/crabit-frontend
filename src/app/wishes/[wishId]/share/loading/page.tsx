import { notFound } from "next/navigation";
import { loadWishDetail } from "../../(detail)/load-wish-detail";
import { LoadingScreen } from "../../../_components/loading-screen";

export default async function WishShareLoadingPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  if ((await loadWishDetail(wishId)) === null) notFound();

  return <LoadingScreen label="학원 피드 공유 중" donePath="/feed" />;
}
