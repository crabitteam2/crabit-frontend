import { ScreenHeader } from "../_components/screen-header";

export default function WishesLoading() {
  return (
    <div className="flex flex-col">
      <ScreenHeader title="진행중인 위시" backHref="/" />
      <div
        role="status"
        aria-label="위시 목록을 불러오는 중"
        className="flex flex-col gap-10 px-4 pb-10"
      >
        <div className="bg-gray-1 h-[172px] animate-pulse rounded-[20px]" />
        <div className="bg-gray-1 h-[172px] animate-pulse rounded-[20px]" />
      </div>
    </div>
  );
}
