import { toSavingPeriodLabel } from "@/app/wishes/_components/wish-period-format";
import { WishCreatedScreen } from "../_components/wish-created-screen";

const PLACEHOLDER_WISH_ID = "w1";

function read(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

export default async function NewWishDonePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const parsed = Number(read(query, "targetAmount") ?? 0);
  const period = toSavingPeriodLabel({
    start: read(query, "startDate") ?? null,
    end: read(query, "targetDate") ?? null,
  });

  return (
    <WishCreatedScreen
      purpose={read(query, "purpose") ?? ""}
      targetAmount={Number.isFinite(parsed) ? parsed : 0}
      period={period === "" ? null : period}
      depositHref={`/wishes/${PLACEHOLDER_WISH_ID}/deposit`}
      closeHref="/"
    />
  );
}
