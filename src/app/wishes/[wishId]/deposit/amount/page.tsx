import { notFound } from "next/navigation";
import { depositContext } from "@/lib/forms/wish-amount-context";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import { findWish } from "@/lib/mock/wishes";
import { AmountForm } from "../../../_components/amount-form";

export default async function DepositAmountPage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const wish = findWish(wishId);
  if (wish === null) notFound();

  const context = depositContext(wish, await searchParams, {
    allowDefaultSource: true,
  });
  if (!context)
    return <FormQueryError backHref={`/wishes/${wishId}/deposit`} />;

  return (
    <AmountForm
      title="얼마를 모아볼까요?"
      backHref={`/wishes/${wishId}/deposit`}
      nextPath={`/wishes/${wishId}/deposit/coin`}
      available={context.available}
      remaining={context.remaining}
      from={context.from}
      availableLabel="현재 사용 가능한 금액"
    />
  );
}
