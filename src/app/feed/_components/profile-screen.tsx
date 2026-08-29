import Image from "next/image";
import Link from "next/link";
import heroImage from "@/../public/images/feed/profile-hero.png";
import searchIcon from "@/../public/images/feed/search.svg";
import arrowLeftIcon from "@/../public/images/wishes/arrow-left.svg";
import type { Wish } from "@/lib/mock/wishes";
import { ProfileWishSection } from "./profile-wish-section";

interface ProfileScreenProps {
  nickname: string;
  inProgress: Wish[];
  finished: Wish[];
  backHref: string;
}

export function ProfileScreen({
  nickname,
  inProgress,
  finished,
  backHref,
}: ProfileScreenProps) {
  return (
    <div className="flex flex-col">
      <div className="relative h-[348px] w-full overflow-hidden bg-gradient-to-b from-[#fcb1d6] to-[#f8f8f8]">
        <Image
          src={heroImage}
          alt=""
          width={320}
          height={320}
          priority
          className="absolute top-[73px] left-1/2 size-[320px] -translate-x-1/2 object-cover"
        />
        <header className="relative flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-4">
          <Link
            href={backHref}
            aria-label="뒤로 가기"
            className="relative block size-8 shrink-0"
          >
            <Image src={arrowLeftIcon} alt="" fill sizes="32px" />
          </Link>
          <button type="button" aria-label="학생 검색" className="block size-8">
            <Image src={searchIcon} alt="" width={32} height={32} />
          </button>
        </header>
      </div>

      <div className="border-gray-3 flex items-center justify-between border-b px-4 py-3">
        <h1 className="text-t2 text-fg-neutral font-semibold">{nickname}</h1>
        <div className="flex items-center gap-5 text-[17px] leading-6 tracking-[-0.3px]">
          <p className="flex items-center gap-1">
            <span className="text-fg-neutral">진행중</span>
            <span className="text-pink-6 font-semibold">
              {toCountLabel(inProgress.length)}
            </span>
          </p>
          <p className="flex items-center gap-1">
            <span className="text-fg-neutral">종료</span>
            <span className="text-pink-6 font-semibold">
              {toCountLabel(finished.length)}
            </span>
          </p>
        </div>
      </div>

      <ProfileWishSection title="진행중인 위시" wishes={inProgress} />
      <ProfileWishSection title="종료된 위시" wishes={finished} />
    </div>
  );
}

function toCountLabel(count: number) {
  return count > 99 ? "99+" : String(count);
}
