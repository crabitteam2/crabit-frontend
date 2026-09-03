import { ACADEMY_NAME, NICKNAME } from "@/lib/mock/home";
import { AcademySection } from "../_components/academy-section";
import { CharacterArea } from "../_components/character-area";
import { HomeHeader } from "../_components/home-header";
import { HomeToast } from "../_components/home-toast";
import { ProgressBar } from "../_components/progress-bar";
import {
  toProgressPercent,
  toProgressStage,
} from "../_components/progress-stage";
import { PullToRefresh } from "../_components/pull-to-refresh";
import { QuickActions } from "../_components/quick-actions";
import { RecapSection } from "../_components/recap-section";
import { ShortageNotice } from "../_components/shortage-notice";
import { TabBar } from "../_components/tab-bar";
import { loadWishlistTab } from "./load-wishlist-tab";

export default async function WishlistTabPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const { representativeWish, unresolvedShortage } = await loadWishlistTab();

  const rawToast = query.toast;
  const toastKey = (Array.isArray(rawToast) ? rawToast[0] : rawToast) ?? null;
  const percent =
    representativeWish === null
      ? 0
      : toProgressPercent(
          representativeWish.amount,
          representativeWish.targetAmount,
        );
  const hasShortage = unresolvedShortage !== null && unresolvedShortage > 0;

  return (
    <div className="flex flex-col">
      <HomeToast toastKey={toastKey} closeHref="/" />

      <PullToRefresh>
        <CharacterArea
          stage={representativeWish === null ? null : toProgressStage(percent)}
        >
          <HomeHeader
            nickname={NICKNAME}
            wishPurpose={representativeWish?.purpose ?? null}
          />
        </CharacterArea>

        <main className="relative -mt-[17px] flex flex-col px-4">
          <ProgressBar
            percent={percent}
            targetAmount={representativeWish?.targetAmount ?? null}
          />
          {hasShortage ? (
            <div className="pt-10">
              <ShortageNotice />
            </div>
          ) : null}
          <div className={hasShortage ? "pt-[68px]" : "pt-10"}>
            <QuickActions isLocked={hasShortage} />
          </div>
          <div className="pt-[68px]">
            <AcademySection academyName={ACADEMY_NAME} />
          </div>
          <div className="pt-[68px]">
            <RecapSection />
          </div>
        </main>

        <div className="h-[182px]" />
      </PullToRefresh>
      <TabBar />
    </div>
  );
}
