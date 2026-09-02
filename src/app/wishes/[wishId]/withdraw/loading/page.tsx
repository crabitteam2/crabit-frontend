import { readAmountQuery } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { LoadingScreen } from "../../../_components/loading-screen";

export default async function WithdrawLoadingPage({
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
    return <FormQueryError backHref={`/wishes/${wishId}/withdraw/amount`} />;

  return (
    <LoadingScreen
      label="돈 꺼내는 중"
      donePath={`/wishes/${wishId}/withdraw/done?amount=${amount}`}
    />
  );
}
