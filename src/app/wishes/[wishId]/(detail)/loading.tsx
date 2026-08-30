import { ScreenHeader } from "../../_components/screen-header";

export default function WishDetailLoading() {
  return (
    <div className="flex flex-col">
      <ScreenHeader title="모은 돈 기록" backHref="/wishes" spacing="tight" />
      <div
        role="status"
        aria-label="위시를 불러오는 중"
        className="flex flex-col gap-6 px-4"
      >
        <div className="bg-gray-1 h-[232px] animate-pulse rounded-[20px]" />
        <div className="bg-gray-1 h-12 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
