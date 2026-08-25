import { ACADEMY_NAME, resolveHomeData } from "@/lib/mock/home";
import { AcademySection } from "./_components/academy-section";
import { CharacterArea } from "./_components/character-area";
import { HomeHeader } from "./_components/home-header";
import { HomeToast } from "./_components/home-toast";
import { ProgressBar } from "./_components/progress-bar";
import {
  toProgressPercent,
  toProgressStage,
} from "./_components/progress-stage";
import { QuickActions } from "./_components/quick-actions";
import { RecapSection } from "./_components/recap-section";
import { ShortageNotice } from "./_components/shortage-notice";
import { TabBar } from "./_components/tab-bar";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const { nickname, representativeWish, unresolvedShortage } =
    resolveHomeData(query);

  const rawToast = query.toast;
  const toastKey = (Array.isArray(rawToast) ? rawToast[0] : rawToast) ?? null;
  const closeParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (key === "toast" || value === undefined) continue;
    closeParams.set(key, Array.isArray(value) ? (value[0] ?? "") : value);
  }
  const closeHref =
    closeParams.size === 0 ? "/" : `/?${closeParams.toString()}`;
  const percent = representativeWish
    ? toProgressPercent(
        representativeWish.amount,
        representativeWish.targetAmount,
      )
    : 0;
  const hasShortage = unresolvedShortage > 0;

  return (
    <div className="flex flex-col">
      <HomeToast toastKey={toastKey} closeHref={closeHref} />

      <CharacterArea
        stage={representativeWish ? toProgressStage(percent) : null}
      >
        <HomeHeader
          nickname={nickname}
          wishPurpose={representativeWish?.purpose ?? null}
        />
      </CharacterArea>

      <main className="relative -mt-[17px] flex flex-col px-4">
        <ProgressBar percent={percent} />
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
      <TabBar />
    </div>
  );
}
