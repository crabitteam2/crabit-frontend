import { toProgressPercent } from "@/app/_components/progress-stage";
import { ScreenHeader } from "@/app/wishes/_components/screen-header";
import { cardAccounts } from "@/lib/mock/accounts";
import { resolveHomeData } from "@/lib/mock/home";
import { resolveWishListData } from "@/lib/mock/wishes";
import { AdjustWishList } from "./_components/adjust-wish-list";

const DEFAULT_SHORTAGE = 5_000;

export default async function AdjustPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const { nickname, unresolvedShortage } = resolveHomeData(query);
  const { inProgress } = resolveWishListData(query);
  const account = cardAccounts[0];

  const wishes = inProgress
    .filter((wish) => wish.amount > 0)
    .map((wish) => ({
      id: wish.id,
      label: wish.purpose,
      amount: wish.amount,
      percent: toProgressPercent(wish.amount, wish.targetAmount),
    }));

  return (
    <div className="flex h-[calc(100svh-env(safe-area-inset-bottom))] flex-col">
      <ScreenHeader title="잔액 조정이 필요해요." backHref="/" />
      <AdjustWishList
        card={{
          label: `${nickname}의 크래빗 카드`,
          balance: account.balance,
          shortage:
            unresolvedShortage > 0 ? unresolvedShortage : DEFAULT_SHORTAGE,
          cardNumber: account.cardNumber,
        }}
        wishes={wishes}
      />
    </div>
  );
}
