import Image from "next/image";
import Link from "next/link";
import warningIcon from "@/../public/images/home/shortage-warning.svg";

export function ShortageNotice() {
  return (
    <Link
      href="/adjust"
      className="bg-pink-1 text-t3 text-fg-neutral flex h-[76px] items-center gap-3 rounded-[20px] px-4 font-medium"
    >
      <span aria-hidden="true" className="relative block size-9 shrink-0">
        <Image src={warningIcon} alt="" fill sizes="36px" />
      </span>
      카드 잔액 조정이 필요해요.
    </Link>
  );
}
