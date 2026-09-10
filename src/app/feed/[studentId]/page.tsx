import { StudentProfileScreen } from "../_components/student-profile-screen";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  return <StudentProfileScreen studentId={studentId} />;
}
