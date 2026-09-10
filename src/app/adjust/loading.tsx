import { ScreenHeader } from "@/app/wishes/_components/screen-header";

export default function AdjustLoading() {
  return (
    <div className="flex flex-col">
      <ScreenHeader title="잔액 조정이 필요해요." backHref="/" />
      <div
        role="status"
        aria-label="잔액 조정 정보를 불러오는 중"
        className="flex flex-col px-4"
      >
        <div className="bg-gray-1 h-[212px] animate-pulse rounded-[20px]" />
        <div className="bg-gray-1 mt-[60px] h-[186px] animate-pulse rounded-[20px]" />
      </div>
    </div>
  );
}
