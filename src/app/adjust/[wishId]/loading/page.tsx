import { readAmountQuery } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { notFound } from "next/navigation";
import { LoadingScreen } from "@/app/wishes/_components/loading-screen";
import { findWish } from "@/lib/mock/wishes";

export default async function AdjustLoadingPage({
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
  const amount = readAmountQuery(query, wish.amount);
  if (amount === null)
    return <FormQueryError backHref={`/adjust/${wishId}/amount`} />;

  return (
    <LoadingScreen
      label="돈 꺼내는 중"
      donePath={`/adjust/${wishId}/done?amount=${amount}`}
    />
  );
}
