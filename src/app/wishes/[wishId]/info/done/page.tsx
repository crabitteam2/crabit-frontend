import { notFound } from "next/navigation";
import { getWish } from "@/lib/http/wishes";
import { unwrapResult } from "@/lib/http/result";
import { loadAccountContext } from "../../../load-account";
import { WishEditDoneScreen } from "../../../_components/wish-edit-done-screen";

export default async function WishEditDonePage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const result = await getWish(client, { cardBalanceAccountId, wishId });
  if (!result.ok && result.error.status === 404) notFound();
  const wish = unwrapResult(result);

  return (
    <WishEditDoneScreen
      purpose={wish.purpose}
      targetAmount={wish.targetAmount}
      period={
        wish.targetDate === null
          ? null
          : `${toDateKey(wish.createdAt)} - ${wish.targetDate.replaceAll("-", ".")}`
      }
    />
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function toDateKey(value: string) {
  return dateFormatter.format(new Date(value)).replaceAll("-", ".");
}
