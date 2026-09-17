import Image from "next/image";
import emptyImage from "@/../public/images/feed/empty.png";
import { ACADEMY_NAME } from "@/lib/mock/home";
import { FeedHeader } from "./feed-header";

export function EmptyFeed() {
  return (
    <div className="flex min-h-dvh flex-col">
      <FeedHeader academyName={ACADEMY_NAME} backHref="/" sortLabel="추천순" />

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <Image
          src={emptyImage}
          alt=""
          width={310}
          sizes="310px"
          height={310}
          priority
          className="size-[310px]"
        />
        <p className="text-fg-neutral-muted pt-5 text-center text-[20px] leading-7 font-medium tracking-[-0.3px]">
          학원 피드에 표시될 위시가 없어요.
          <br />
          친구들이 등록하면 여기에서 볼 수 있어요.
        </p>
      </div>
    </div>
  );
}
