import { redirect } from "next/navigation";
import { AdjustWithdrawForm } from "./_components/adjust-withdraw-form";
import { loadAdjust } from "./load-adjust";

export default async function AdjustPage() {
  const view = await loadAdjust();
  if (view === null) redirect("/");

  return <AdjustWithdrawForm shortage={view.shortage} wishes={view.wishes} />;
}
