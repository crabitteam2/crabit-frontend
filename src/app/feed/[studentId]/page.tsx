import { RealProfile } from "../_components/real-profile";
export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  return <RealProfile studentId={studentId} />;
}
