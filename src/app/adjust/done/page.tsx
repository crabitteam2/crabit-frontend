import { loadAccountContext } from "@/app/wishes/load-account";
import { AdjustDoneScreen } from "../_components/adjust-done-screen";

export default async function AdjustDonePage() {
  const { account } = await loadAccountContext();

  return <AdjustDoneScreen balance={account.actualCardBalance ?? 0} />;
}
