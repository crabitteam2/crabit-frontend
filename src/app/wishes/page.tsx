import { resolveWishListData } from "@/lib/mock/wishes";
import { EmptyWishes } from "./_components/empty-wishes";
import { ScreenHeader } from "./_components/screen-header";
import { TopButton } from "./_components/top-button";
import { WishList } from "./_components/wish-list";

export default async function WishesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { inProgress, finished } = resolveWishListData(await searchParams);

  if (inProgress.length === 0 && finished.length === 0) {
    return <EmptyWishes />;
  }

  return (
    <div className="flex flex-col">
      <ScreenHeader title="진행중인 위시" backHref="/" />
      <WishList inProgress={inProgress} finished={finished} />
      <TopButton />
    </div>
  );
}
