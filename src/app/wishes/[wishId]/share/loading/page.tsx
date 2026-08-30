import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { LoadingScreen } from "../../../_components/loading-screen";

export default async function WishShareLoadingPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  if (findWish(wishId) === null) notFound();

  return <LoadingScreen label="학원 피드 공유 중" donePath="/feed" />;
}
