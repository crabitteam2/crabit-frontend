import { PullToRefresh } from "@/app/_components/pull-to-refresh";
import { ScreenHeader } from "../_components/screen-header";
import { TopButton } from "../_components/top-button";
import { WishList } from "../_components/wish-list";
import { loadWishList } from "../(list)/load-wish-list";

export default async function FinishedWishesPage() {
  const { inProgress, finished, representativeId } = await loadWishList();

  return (
    <div className="flex flex-col">
      <ScreenHeader title="종료된 위시" backHref="/wishes" backToPrevious />
      <PullToRefresh>
        <WishList
          mode="finished"
          inProgress={inProgress}
          finished={finished}
          representativeId={representativeId}
        />
      </PullToRefresh>
      <TopButton />
    </div>
  );
}
