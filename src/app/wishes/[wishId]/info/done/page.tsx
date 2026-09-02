import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { WishEditDoneScreen } from "../../../_components/wish-edit-done-screen";

function read(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

export default async function WishEditDonePage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const wish = findWish(wishId);
  if (wish === null) notFound();

  const query = await searchParams;
  const parsed = Number(read(query, "targetAmount") ?? wish.targetAmount);

  return (
    <WishEditDoneScreen
      purpose={read(query, "purpose") ?? wish.purpose}
      targetAmount={Number.isFinite(parsed) ? parsed : wish.targetAmount}
      period={read(query, "period") ?? null}
    />
  );
}
