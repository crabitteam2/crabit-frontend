import Image from "next/image";
import Link from "next/link";
import closeIcon from "@/../public/images/wishes/close-32.svg";
import emptyImage from "@/../public/images/feed/empty.png";

export function EmptyFeed() {
  return (
    <div className="flex min-h-[calc(100svh-env(safe-area-inset-bottom))] flex-col px-4 pt-[calc(env(safe-area-inset-top)+12px)]">
      <div className="flex justify-end">
        <Link href="/" aria-label="닫기" className="relative block size-8">
          <Image src={closeIcon} alt="" fill sizes="32px" />
        </Link>
      </div>
      <div className="flex flex-col items-center pt-[72px]">
        <Image
          src={emptyImage}
          alt=""
          width={310}
          height={310}
          priority
          className="size-[310px]"
        />
        <p className="text-fg-neutral-muted pt-5 text-center text-[20px] leading-7 font-medium tracking-[-0.3px]">
          학원 피드에 표시될 내용이 없어요.
          <br />내 위시리스트를 공유해볼까요?
        </p>
      </div>
      <div className="flex-1" />
      <div className="pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Link
          href="/wishes"
          className="bg-brand-solid text-fg-contrast text-b3 flex h-14 w-full items-center justify-center rounded-xl px-6 font-semibold"
        >
          내 위시리스트 공유하기
        </Link>
      </div>
    </div>
  );
}
