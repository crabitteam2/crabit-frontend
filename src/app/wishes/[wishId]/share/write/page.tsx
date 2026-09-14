import { redirect } from "next/navigation";
import { toProgressPercent } from "@/app/_components/progress-stage";
import { loadWishDetail } from "../../(detail)/load-wish-detail";
import { ScreenHeader } from "../../../_components/screen-header";
import { WishHeroContent } from "../../../_components/wish-hero-screen";
import { toSavingPeriodLabel } from "../../../_components/wish-period-format";
import { getWishShareLook } from "../../../_components/wish-share-theme";
import { WishShareWriteForm } from "../../../_components/wish-share-write-form";

export default async function WishShareWritePage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  const view = await loadWishDetail(wishId);
  if (view === null) redirect("/wishes");
  if (view.wish.visibility !== "PRIVATE") redirect("/feed/me");

  const { wish } = view;

  const look = getWishShareLook(wish);
  const period = toSavingPeriodLabel({
    start: wish.startDate,
    end: wish.targetDate,
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader
        title="새로 글 작성하기"
        backHref={`/wishes/${wishId}/share`}
        spacing="tight"
      />

      <div className="bg-pink-1">
        <WishHeroContent
          character={look.character}
          photo={wish.photo ?? null}
          headline={look.headline}
          headlinePaddingTop={look.headlinePaddingTop}
          headlinePaddingBottom={look.headlinePaddingBottom}
          percent={toProgressPercent(wish.amount, wish.targetAmount)}
          theme={look.theme}
          purpose={wish.purpose}
          period={period === "" ? null : period}
          amount={wish.amount}
          targetAmount={wish.targetAmount}
          showAmount={false}
        />
        <div className="h-5" />
      </div>

      <WishShareWriteForm
        ticketName={`share:${wishId}`}
        donePath={`/wishes/${wishId}/share/loading`}
      />
    </div>
  );
}
