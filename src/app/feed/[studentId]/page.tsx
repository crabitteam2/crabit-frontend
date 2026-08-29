import { notFound } from "next/navigation";
import { findStudentProfile } from "@/lib/mock/feed";
import { ProfileScreen } from "../_components/profile-screen";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const profile = findStudentProfile(studentId);
  if (profile === null) notFound();

  return (
    <ProfileScreen
      nickname={profile.nickname}
      inProgress={profile.inProgress}
      finished={profile.finished}
      backHref="/feed"
      showMore
    />
  );
}
