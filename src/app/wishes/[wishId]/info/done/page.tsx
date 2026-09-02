import { readWishQuery } from "@/lib/forms/wish-form-query";
import { FormQueryError } from "@/app/wishes/_components/form-query-error";
import {
  toPeriodLabel,
  toFullDate,
} from "@/app/wishes/_components/wish-period-format";
import { notFound } from "next/navigation";
import { findWish } from "@/lib/mock/wishes";
import { WishEditDoneScreen } from "../../../_components/wish-edit-done-screen";

export default async function WishEditDonePage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const wish = findWish(wishId);
  if (wish === null) notFound();

  const values = readWishQuery(await searchParams, {
    purpose: wish.purpose,
    targetAmount: wish.targetAmount,
    currentAmount: wish.amount,
    range: {
      start: toFullDate(wish.startDate),
      end: toFullDate(wish.targetDate),
    },
  });
  if (!values)
    return <FormQueryError backHref={`/wishes/${wishId}/info/edit`} />;

  return (
    <WishEditDoneScreen
      purpose={values.purpose}
      targetAmount={values.targetAmount}
      period={toPeriodLabel(values.range) || null}
    />
  );
}
