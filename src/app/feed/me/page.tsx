import { ProfileScreen } from "../_components/profile-screen";
import { loadMyProfile } from "./load-my-profile";

export default async function MyProfilePage() {
  let profile;
  try {
    profile = await loadMyProfile();
  } catch {
    return (
      <p
        role="alert"
        className="text-fg-neutral-muted px-4 py-10 text-center text-[20px] leading-7 font-medium tracking-[-0.3px]"
      >
        프로필을 불러오지 못했어요
        <br />
        잠시 후 다시 시도해 주세요
      </p>
    );
  }
  return (
    <ProfileScreen
      {...profile}
      backHref="/feed"
      followsHref="/feed/me/follows"
    />
  );
}
