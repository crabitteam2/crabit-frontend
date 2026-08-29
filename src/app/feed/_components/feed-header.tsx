import Image from "next/image";
import Link from "next/link";
import arrowLeftIcon from "@/../public/images/wishes/arrow-left.svg";
import personIcon from "@/../public/images/feed/person.svg";
import searchIcon from "@/../public/images/feed/search.svg";

interface FeedHeaderProps {
  academyName: string;
  backHref: string;
}

export function FeedHeader({ academyName, backHref }: FeedHeaderProps) {
  return (
    <header className="bg-layer-default sticky top-0 z-20">
      <div className="border-gray-3 flex items-center justify-between border-b px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
        <Link
          href={backHref}
          aria-label="뒤로 가기"
          className="relative block size-8 shrink-0"
        >
          <Image src={arrowLeftIcon} alt="" fill sizes="32px" />
        </Link>
        <div className="flex shrink-0 items-center gap-3">
          <button type="button" aria-label="학생 검색" className="block size-8">
            <Image src={searchIcon} alt="" width={32} height={32} />
          </button>
          <Link href="/feed/me" aria-label="내 프로필" className="block size-8">
            <Image src={personIcon} alt="" width={32} height={32} />
          </Link>
        </div>
      </div>

      <div className="border-gray-3 flex items-end justify-between border-b px-4 pt-3 pb-4">
        <h1 className="text-t1 text-fg-neutral font-bold">{academyName}</h1>
        <p className="text-gray-7 text-b4 font-medium">추천순</p>
      </div>
    </header>
  );
}
