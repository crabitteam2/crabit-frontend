import { ProfileScreen } from "../_components/profile-screen";
import { loadMyProfile } from "./load-my-profile";

export default async function MyProfilePage() {
  const profile = await loadMyProfile();

  return (
    <ProfileScreen
      {...profile}
      backHref="/feed"
      followsHref="/feed/me/follows"
    />
  );
}
