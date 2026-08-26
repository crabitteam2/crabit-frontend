import { cardAccounts } from "@/lib/mock/accounts";
import { WishGoalForm } from "./_components/wish-goal-form";

export default function NewWishPage() {
  const account = cardAccounts[0];

  return (
    <WishGoalForm
      backHref="/wishes"
      nextPath="/wishes/new/period"
      available={account?.balance ?? 0}
    />
  );
}
