import { WishPeriodForm } from "../_components/wish-period-form";

function read(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

export default async function NewWishPeriodPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const parsed = Number(read(query, "targetAmount") ?? 0);

  return (
    <WishPeriodForm
      backHref="/wishes/new"
      nextPath="/wishes/new/photo"
      purpose={read(query, "purpose") ?? ""}
      targetAmount={Number.isFinite(parsed) ? parsed : 0}
    />
  );
}
