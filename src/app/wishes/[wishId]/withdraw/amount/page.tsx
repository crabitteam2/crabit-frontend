import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { AmountForm } from "../../../_components/amount-form";

export default async function WithdrawAmountPage({
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
      backHref={`/wishes/${wishId}/withdraw`}
      nextPath={`/wishes/${wishId}/withdraw/loading`}
      available={wish.amount}
      availableLabel="현재 출금 가능한 금액"
    />
  );
}
