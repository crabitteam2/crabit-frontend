import { PullToRefresh } from "@/app/_components/pull-to-refresh";
import { TopButton } from "@/app/wishes/_components/top-button";
import { resolveFeedCards, resolveFeedSort } from "@/lib/mock/feed";
import { ACADEMY_NAME } from "@/lib/mock/home";
import { EmptyFeed } from "./_components/empty-feed";
import { FeedCard } from "./_components/feed-card";
import { FeedHeader } from "./_components/feed-header";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const cards = resolveFeedCards(query);
  const sort = resolveFeedSort(query);

  if (cards.length === 0) {
    return <EmptyFeed />;
  }

  return (
    <div className="flex flex-col">
      <FeedHeader
        academyName={ACADEMY_NAME}
        backHref="/"
        sortLabel={sort === "latest" ? "최신순" : "추천순"}
        sortHref={sort === "latest" ? "/feed" : "/feed?sort=latest"}
      />
      <PullToRefresh>
        <ul className="flex flex-col pb-10">
          {cards.map((card) => (
            <li key={card.id}>
              <FeedCard card={card} />
            </li>
          ))}
        </ul>
      </PullToRefresh>
      <TopButton />
    </div>
  );
}
