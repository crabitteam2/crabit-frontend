import { notFound } from "next/navigation";
import { findStudentProfile } from "@/lib/mock/feed";
import { StudentProfile } from "../_components/student-profile";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const profile = findStudentProfile(studentId);
  if (profile === null) notFound();

  return <StudentProfile profile={profile} />;
}
