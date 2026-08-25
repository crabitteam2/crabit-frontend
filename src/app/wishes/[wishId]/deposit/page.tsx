import { notFound } from "next/navigation";
import { cardAccounts } from "@/lib/mock/accounts";
import { findWish, resolveWishListData } from "@/lib/mock/wishes";
import { AccountSelect } from "../../_components/account-select";
import { ScreenHeader } from "../../_components/screen-header";

export default async function DepositAccountPage({
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
  const { inProgress } = resolveWishListData(query);
  const sources = inProgress.filter((item) => item.id !== wishId);

  return (
    <div className="flex flex-col">
      <ScreenHeader
        title="이체할 카드를 선택해주세요."
        backHref={`/wishes/${wishId}`}
        spacing="loose"
      />
      <AccountSelect wishId={wishId} accounts={cardAccounts} wishes={sources} />
    </div>
  );
}
