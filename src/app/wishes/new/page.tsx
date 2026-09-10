import { getCardBalanceAccount } from "@/lib/http/card-balance-accounts";
import { unwrapResult } from "@/lib/http/result";
import { loadAccountContext } from "../load-account";
import { WishGoalForm } from "./_components/wish-goal-form";

export default async function NewWishPage() {
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const account = unwrapResult(
    await getCardBalanceAccount(client, { cardBalanceAccountId }),
  );

  return (
    <WishGoalForm
      backHref="/wishes"
      nextPath="/wishes/new/period"
      available={account.displayAvailableBalance}
      cardBalanceAccountId={cardBalanceAccountId}
    />
  );
}
