import { redirect } from "next/navigation";
import { ScreenHeader } from "@/app/wishes/_components/screen-header";
import { NICKNAME } from "@/lib/mock/home";
import { AdjustWishList } from "./_components/adjust-wish-list";
import { loadAdjust } from "./load-adjust";

export default async function AdjustPage() {
  const view = await loadAdjust(NICKNAME);
  if (view === null) redirect("/");

  return (
    <div className="flex h-[calc(100svh-env(safe-area-inset-bottom))] flex-col">
      <ScreenHeader title="잔액 조정이 필요해요." backHref="/" />
      <AdjustWishList card={view.card} wishes={view.wishes} />
    </div>
  );
}
