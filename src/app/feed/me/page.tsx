import { homeCard } from "@/lib/mock/home";
import { resolveWishListData } from "@/lib/mock/wishes";
import { ProfileScreen } from "../_components/profile-screen";

export default async function MyProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const { inProgress, finished } = resolveWishListData(query);

  return (
    <ProfileScreen
      nickname={homeCard.ownerName}
      inProgress={inProgress}
      finished={finished}
      backHref="/feed"
    />
  );
}
