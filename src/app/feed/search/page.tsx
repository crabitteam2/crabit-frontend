import { RECENT_SEARCHES } from "@/lib/mock/feed";
import { FeedSearch } from "../_components/feed-search";

export default function FeedSearchPage() {
  return <FeedSearch recentSearches={RECENT_SEARCHES} />;
}
