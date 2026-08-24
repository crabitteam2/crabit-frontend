import Image from "next/image";
import Link from "next/link";
import closeIcon from "@/../public/images/wishes/close-32.svg";
import emptyImage from "@/../public/images/wishes/empty.png";
import { Button } from "@/components/ui/button";

export function EmptyWishes() {
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
          위시리스트가 텅~ 비어 있어요
          <br />
          지금 만들러 가볼까요?
        </p>
      </div>
      <div className="flex-1" />
      <div className="pb-[calc(55px+env(safe-area-inset-bottom))]">
        <Button size="xlarge" className="w-full">
          위시리스트 만들기
        </Button>
      </div>
    </div>
  );
}
