import { redirect } from "next/navigation";
import { MY_STUDENT_ID } from "@/lib/mock/me";
import { StudentProfileScreen } from "../_components/student-profile-screen";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  if (studentId === MY_STUDENT_ID) redirect("/feed/me");

  return <StudentProfileScreen studentId={studentId} />;
}
