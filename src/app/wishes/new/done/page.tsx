import { readWishQuery } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { toSavingPeriodLabel } from "@/app/wishes/_components/wish-period-format";
import { WishCreatedScreen } from "../_components/wish-created-screen";

const PLACEHOLDER_WISH_ID = "w1";

export default async function NewWishDonePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const values = readWishQuery(await searchParams);
  if (!values) return <FormQueryError backHref="/wishes/new" />;
  const period = toSavingPeriodLabel(values.range);

  return (
    <WishCreatedScreen
      purpose={values.purpose}
      targetAmount={values.targetAmount}
      period={period === "" ? null : period}
      depositHref={`/wishes/${PLACEHOLDER_WISH_ID}/deposit/amount`}
      closeHref="/"
    />
  );
}
