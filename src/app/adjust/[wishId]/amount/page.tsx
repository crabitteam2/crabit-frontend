import { notFound } from "next/navigation";
import { AmountForm } from "@/app/wishes/_components/amount-form";
import { findWish } from "@/lib/mock/wishes";

export default async function AdjustAmountPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const wish = findWish(wishId);
  if (wish === null) notFound();

  return (
    <AmountForm
      title="얼마를 출금할까요?"
      backHref="/adjust"
      nextPath={`/adjust/${wishId}/loading`}
      available={wish.amount}
      availableLabel="현재 출금 가능한 금액"
    />
  );
}
