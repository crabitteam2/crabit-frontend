import noticeBookIcon from "@/../public/images/home/notice-book.svg";
import transitCardIcon from "@/../public/images/home/transit-card.svg";
import { ACADEMY_NAME, homeCard } from "@/lib/mock/home";
import { PullToRefresh } from "../_components/pull-to-refresh";
import { TabBar } from "../_components/tab-bar";
import { HomeTabHeader } from "./_components/home-tab-header";
import { LinkRow } from "./_components/link-row";
import { MyCard } from "./_components/my-card";
import { NoticeBanner } from "./_components/notice-banner";

export default function HomeTabPage() {
  return (
    <div className="bg-layer-basement flex min-h-svh flex-col">
      <HomeTabHeader academyName={ACADEMY_NAME} />

      <PullToRefresh>
        <main className="flex flex-col pb-[calc(96px+env(safe-area-inset-bottom))]">
          <h2 className="text-t2 text-fg-neutral px-4 pb-2 font-semibold">
            나의 카드
          </h2>
          <div className="px-4 pb-5">
            <MyCard
              ownerName={homeCard.ownerName}
              balance={homeCard.balance}
              wishAvailableBalance={homeCard.wishAvailableBalance}
            />
          </div>
          <div className="px-4 pb-10">
            <LinkRow icon={transitCardIcon} label="교통카드 잔액 조회하기" />
          </div>

          <h2 className="text-t2 text-fg-neutral px-4 pb-2 font-semibold">
            공지사항
          </h2>
          <div className="px-4 pb-5">
            <NoticeBanner />
          </div>
          <div className="px-4 pb-5">
            <LinkRow icon={noticeBookIcon} label={`${ACADEMY_NAME} 공지사항`} />
          </div>
        </main>
      </PullToRefresh>

      <TabBar />
    </div>
  );
}
