import Image from "next/image";
import Link from "next/link";
import personIcon from "@/../public/images/feed/person.svg";
import searchIcon from "@/../public/images/feed/search.svg";
import { BackButton } from "@/components/ui/back-button";

interface FeedHeaderProps {
  academyName: string;
  /** 기록이 없을 때 뒤로가기가 갈 경로입니다. */
  backHref: string;
  /** 현재 정렬 기준의 이름입니다. */
  sortLabel: string;
}

export function FeedHeader({
  academyName,
  backHref,
  sortLabel,
}: FeedHeaderProps) {
  return (
    <header className="bg-layer-default sticky top-0 z-20">
      <div className="border-gray-3 flex items-center justify-between border-b px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
        <BackButton
          fallbackHref={backHref}
          className="relative block size-8 shrink-0"
        />
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/feed/search"
            aria-label="학생 검색"
            className="block size-8"
          >
            <Image src={searchIcon} alt="" width={32} height={32} />
          </Link>
          <Link href="/feed/me" aria-label="내 프로필" className="block size-8">
            <Image src={personIcon} alt="" width={32} height={32} />
          </Link>
        </div>
      </div>

      <div className="border-gray-3 flex items-end justify-between border-b px-4 pt-3 pb-4">
        <h1 className="text-t1 text-fg-neutral font-bold">{academyName}</h1>
        <span className="text-gray-7 text-b4 font-medium">{sortLabel}</span>
      </div>
    </header>
  );
}
