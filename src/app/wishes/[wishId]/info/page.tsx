import { redirect } from "next/navigation";

/** 읽기 전용 기본 정보 화면을 없애면서 남은 주소를 위시 상세로 보냅니다. */
export default async function WishInfoPage({
  params,
}: {
  params: Promise<{ wishId: string }>;
}) {
  const { wishId } = await params;
  redirect(`/wishes/${wishId}`);
}
