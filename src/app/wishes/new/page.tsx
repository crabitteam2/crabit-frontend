import { readWishQuery } from "@/lib/forms/wish-form-query";
import { getCardBalanceAccount } from "@/lib/http/card-balance-accounts";
import { unwrapResult } from "@/lib/http/result";
import { loadAccountContext } from "../load-account";
import { WishGoalForm } from "./_components/wish-goal-form";

export default async function NewWishPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const values = readWishQuery(await searchParams);
  const { client, cardBalanceAccountId } = await loadAccountContext();
  const account = unwrapResult(
    await getCardBalanceAccount(client, { cardBalanceAccountId }),
  );

  return (
    <WishGoalForm
      backHref="/"
      nextPath="/wishes/new/period"
      initialPurpose={values?.purpose ?? ""}
      initialAmount={values === null ? "" : String(values.targetAmount)}
      initialRange={values?.range ?? { start: null, end: null }}
      available={account.displayAvailableBalance}
      cardBalanceAccountId={cardBalanceAccountId}
    />
  );
}
