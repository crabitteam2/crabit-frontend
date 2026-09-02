import { readWishQuery } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { WishPeriodForm } from "../_components/wish-period-form";

export default async function NewWishPeriodPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const values = readWishQuery(await searchParams);
  if (!values) return <FormQueryError backHref="/wishes/new" />;

  return (
    <WishPeriodForm
      backHref="/wishes/new"
      nextPath="/wishes/new/photo"
      purpose={values.purpose}
      targetAmount={values.targetAmount}
      initialRange={values.range}
    />
  );
}
