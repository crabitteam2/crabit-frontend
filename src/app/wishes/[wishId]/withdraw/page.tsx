import { notFound } from "next/navigation";
import { PullToRefresh } from "@/app/_components/pull-to-refresh";
import { cardAccounts } from "@/lib/mock/accounts";
import { findWish, resolveWishListData } from "@/lib/mock/wishes";
import { AccountSelect } from "../../_components/account-select";
import { ScreenHeader } from "../../_components/screen-header";

export default async function WithdrawAccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ wishId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { wishId } = await params;
  const wish = findWish(wishId);
  if (wish === null) notFound();

  const { inProgress } = resolveWishListData(await searchParams);
  const targets = inProgress.filter((item) => item.id !== wishId);

  return (
    <div className="flex flex-col">
      <ScreenHeader
        title="어떤 카드에서 보낼까요?"
        backHref={`/wishes/${wishId}`}
        spacing="loose"
      />
      <PullToRefresh>
        <AccountSelect
          nextPath={`/wishes/${wishId}/withdraw/amount`}
          accounts={cardAccounts}
          wishes={targets}
        />
      </PullToRefresh>
    </div>
  );
}
