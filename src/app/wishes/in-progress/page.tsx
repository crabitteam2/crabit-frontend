import { PullToRefresh } from "@/app/_components/pull-to-refresh";
import { ScreenHeader } from "../_components/screen-header";
import { TopButton } from "../_components/top-button";
import { WishList } from "../_components/wish-list";
import { loadWishList } from "../(list)/load-wish-list";

export default async function InProgressWishesPage() {
  const { inProgress, finished, representativeId } = await loadWishList();

  return (
    <div className="flex flex-col">
      <ScreenHeader title="진행중인 위시" backHref="/wishes" backToPrevious />
      <PullToRefresh>
        <WishList
          mode="in-progress"
          inProgress={inProgress}
          finished={finished}
          representativeId={representativeId}
        />
      </PullToRefresh>
      <TopButton />
    </div>
  );
}
