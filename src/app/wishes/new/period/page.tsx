import { queryValue, readWishQuery } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { WishPeriodForm } from "../_components/wish-period-form";

export default async function NewWishPeriodPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const cardBalanceAccountId = queryValue(query, "cardBalanceAccountId");
  const values = readWishQuery(query);
  if (!values || !cardBalanceAccountId?.trim())
    return <FormQueryError backHref="/wishes/new" />;

  return (
    <WishPeriodForm
      backHref="/wishes/new"
      nextPath="/wishes/new/photo"
      cardBalanceAccountId={cardBalanceAccountId}
      purpose={values.purpose}
      targetAmount={values.targetAmount}
      initialRange={values.range}
    />
  );
}
